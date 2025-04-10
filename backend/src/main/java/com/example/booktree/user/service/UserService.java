package com.example.booktree.user.service;


import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.role.repository.RoleRepository;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import java.time.LocalDateTime;
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


    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.USER_NOT_FOUND));
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
        RoleValidation(userPostRequestDto.getRoleId());

    }



    public void RoleValidation(Long roleId){
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
