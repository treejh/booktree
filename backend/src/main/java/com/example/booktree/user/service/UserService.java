package com.example.booktree.user.service;


import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.role.entity.Role;
import com.example.booktree.role.repository.RoleRepository;
import com.example.booktree.user.dto.request.UserRequestDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.repository.UserRepository;
import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import com.example.booktree.user.entity.User;
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


    public User createUser(UserRequestDto userRequestDto){
        //이메일, 전화번호, 역할 검증
        UserValidation(userRequestDto);

        // username 비어있으면 랜덤 UUID 일부로 생성
        String username = userRequestDto.getUsername();
        if (username == null || username.trim().isEmpty()) {
            username = "bookTree_" + UUID.randomUUID().toString().substring(0, 8);
        }

        User user = User.builder()
                .email(userRequestDto.getEmail())
                .password(passwordEncoder.encode(userRequestDto.getPassword()))
                .phoneNumber(userRequestDto.getPhoneNumber())
                //이미 UserValidation에서 검증을 했기 때문에 get() 사용
                .role(roleRepository.findById(userRequestDto.getRoleId()).get())
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .username(username).build();

        return userRepository.save(user);
    }


    public void UserValidation(UserRequestDto userRequestDto){
        validationEmail(userRequestDto.getEmail());
        validationPhoneNumber(userRequestDto.getPhoneNumber());
        RoleValidation(userRequestDto.getRoleId());

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
                    throw new BusinessLogicException(ExceptionCode.ALREADY_HAS_EMAIL);
                });

    }
}
