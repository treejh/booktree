package com.example.booktree.user.service;


import com.example.booktree.blog.entity.Blog;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.role.repository.RoleRepository;
import com.example.booktree.user.dto.request.UserPasswordRequestDto;
import com.example.booktree.user.dto.request.UserPatchRequestDto;
import com.example.booktree.user.dto.request.UserPhoneNumberRequestDto;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;


    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }

    public void saveUser(User user){
        userRepository.save(user);
    }


    public User createUser(UserPostRequestDto userPostRequestDto){
        //이메일, 전화번호, 역할 검증
        UserValidation(userPostRequestDto);

        // username 비어있으면 랜덤 UUID 일부로 생성
        String username = userPostRequestDto.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = "bookTree_" + UUID.randomUUID().toString().substring(0, 8);
        }

        User user = User.builder()
                .email(userPostRequestDto.getEmail())
                .password(passwordEncoder.encode(userPostRequestDto.getPassword()))
                .phoneNumber(userPostRequestDto.getPhoneNumber())
                //이미 UserValidation에서 검증을 했기 때문에 get() 사용
                .role(roleRepository.findById(userPostRequestDto.getRoleId()).get())
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .username(username).build();

        return userRepository.save(user);
    }

    public User findByUserEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }

    public boolean validPassword(String dtoPassword, String userPassword){
        return passwordEncoder.matches(dtoPassword,userPassword);
    }


    public void UserValidation(UserPostRequestDto userPostRequestDto){
        validationEmail(userPostRequestDto.getEmail());
        validationPhoneNumber(userPostRequestDto.getPhoneNumber());
        roleValidation(userPostRequestDto.getRoleId());

    }

    //토큰으로 유저 조회
    public User findUsersByToken(){
        return userRepository.findById(tokenService.getIdFromToken())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
    }


    //유저 수정
    //UserPatchRequestDto
    public User updateUser(UserPatchRequestDto userPatchRequestDto){
        //이게 필요한가 ..? ㄷ
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        Optional.ofNullable(userPatchRequestDto.getUsername()).ifPresent(user::setUsername);
        Optional.ofNullable(userPatchRequestDto.getEmail()).ifPresent(user::setEmail);
        Optional.ofNullable(userPatchRequestDto.getPassword())
                .ifPresent(password -> user.setPassword(passwordEncoder.encode(password)));
        Optional.ofNullable(userPatchRequestDto.getPhoneNumber()).ifPresent(user::setPhoneNumber);

        user.setModifiedAt(LocalDateTime.now());

        userRepository.save(user);
        return user;

    }

    public void deleteUser(){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        userRepository.delete(user);
    }


    public User updatePw(UserPasswordRequestDto userPasswordRequestDto){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        //비밀번호 다르면 변경 불가
        pwValidation(userPasswordRequestDto.getBeforePassword(),user.getPassword());

        user.setPassword(passwordEncoder.encode(userPasswordRequestDto.getChangePassword()));
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateEmail(String email){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        user.setEmail(email);
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);

    }

    public User updateUserName(String name){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        user.setUsername(name);
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updatePhoneNumber(UserPhoneNumberRequestDto userPhoneNumberRequestDto){
        Long userId = tokenService.getIdFromToken();
        User user = ownerValidation(userId);

        user.setPhoneNumber(userPhoneNumberRequestDto.getPhoneNumber());
        user.setModifiedAt(LocalDateTime.now());
        return userRepository.save(user);
    }


    
    public User ownerValidation(Long userId){
        User user = findById(userId);


        if (!userId.equals(user.getId())) {
            throw new BusinessLogicException(ExceptionCode.USER_NOT_OWNER);
        }

        return user;
    }




    public void pwValidation(String beforePassword, String currentPassword){
        if (!passwordEncoder.matches(beforePassword, currentPassword)) {
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        }
    }

    public void roleValidation(Long roleId){
        roleRepository.findById(roleId)
                .orElseThrow(()-> new BusinessLogicException(ExceptionCode.ROLE_NOT_FOUND));

    }


    public void validationEmail(String email){
        userRepository.findByEmail(email)
                .ifPresent(user -> {
                    throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_EMAIL);
                });
    }

    public void validationPhoneNumber(String phoneNumber){
        userRepository.findByPhoneNumber(phoneNumber)
                .ifPresent(user -> {
                    throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_PHONENUMBER);
                });

    }
}
