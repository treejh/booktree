package com.example.booktree.user.service;


import com.example.booktree.enums.RoleType;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.jwt.service.TokenService;
import com.example.booktree.role.entity.Role;
import com.example.booktree.role.repository.RoleRepository;
import com.example.booktree.user.dto.request.UserPasswordRequestDto;

import com.example.booktree.user.dto.request.UserPatchRequestDto;
import com.example.booktree.user.dto.request.UserPhoneNumberRequestDto;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import com.example.booktree.utils.CreateRandomNumber;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.Optional;
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

    public User findByToken() {
        Long userId= tokenService.getIdFromToken();
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
            username = "bookTree_" + CreateRandomNumber.randomNumber();
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

    public User createAdmin(UserPostRequestDto userPostRequestDto){
        //이메일, 전화번호, 역할 검증
        UserValidation(userPostRequestDto);

        // username 비어있으면 랜덤 UUID 일부로 생성
        String username = userPostRequestDto.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = "Admin_" + CreateRandomNumber.randomNumber();
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



    public User findUserByEmail(String email){
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
        
    }

    //임시 비밀번호 발급 - 이메일로 비밀번호
    public String findPasswordByEmail(String email){

        User user = findUserByEmail(email);
        String randomPassword = CreateRandomNumber.randomNumber();
        user.setPassword(passwordEncoder.encode(randomPassword));
        userRepository.save(user);
        return randomPassword;
    }

    //임시 비밀번호 발급 - 핸드폰 번호로 비밀번호
    public String findPasswordByPhoneNumber(String phoneNumber){

        User user = findUserByPhoneNumber(phoneNumber);
        String randomPassword = CreateRandomNumber.randomNumber();
        user.setPassword(passwordEncoder.encode(randomPassword));

        userRepository.save(user);
        return randomPassword;
    }




    //아이디 찾기 - 핸드폰 번호로
    public String findEmailByPhoneNumber(UserPhoneNumberRequestDto userPhoneNumberRequestDto){
        User user = findUserByPhoneNumber(userPhoneNumberRequestDto.getPhoneNumber());
        return user.getEmail();
    }




    public User findUserByPhoneNumber(String phoneNumber){
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }

    public User findUserByPassword(String passWord){
        return userRepository.findByPassword(passWord)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));

    }



    public void validPasswordCorrect(UserPasswordRequestDto.PasswordDto passwordDto){
        Long userId = tokenService.getIdFromToken();
        User user = findById(userId);
        if(!passwordEncoder.matches(passwordDto.getPassword(),user.getPassword())){
            throw new BusinessLogicException(ExceptionCode.INVALID_PASSWORD);
        };
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



    public void deleteUserById(Long userId){
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

    public void modify(User user, @NotBlank String username){
        user.setUsername(username);
    }

    public User modifyOrJoins(String email, String username,String provider, String socialId){
        Optional<User> opUser = userRepository.findByEmail(email);

        if(opUser.isPresent()){
            User user = opUser.get();
            modify(user,username);
            return user;
        }

        return createSocialUser(email, "",username,provider,socialId);
    }


    public User createSocialUser(String email, String password, String username,String provider,String socialId){

        Role role = roleRepository.findByRole(RoleType.USER)
                .orElseThrow(()-> new BusinessLogicException(ExceptionCode.ROLE_NOT_FOUND));


        User user = User.builder()
                .email(email)
                .password(password)
                .username(username)
                .phoneNumber(" ")
                .ssoProvider(provider)
                .role(role)
                .socialId(socialId)
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }


    @Transactional
    public Optional<User> findBySocialIdAndSsoProvider(String socialId, String ssoProvider){
        return userRepository.findBySocialIdAndSsoProvider(socialId, ssoProvider);
    }



    
}
