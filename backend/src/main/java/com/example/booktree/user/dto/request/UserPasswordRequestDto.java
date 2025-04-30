package com.example.booktree.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class UserPasswordRequestDto {

    @NotEmpty
    @Pattern(
            regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*\\W).{8,20}$",
            message = "비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자리."
    )

    private String changePassword;

    @NotEmpty
    private String beforePassword;



    @Getter
    @AllArgsConstructor
    public static class FindEmailByPwANDPhone {
        @NotEmpty
        @Pattern(
                regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*\\W).{8,20}$",
                message = "비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자리."
        )
        private String password;

        @NotBlank
        @Pattern(regexp = "^\\d{3}-\\d{4}-\\d{4}$", message = "전화번호 형식은 010-1234-5678이어야 합니다.")
        private String phoneNumber;

    }

    @Getter
    @AllArgsConstructor
    public static class PasswordDto {
        @NotEmpty
        @Pattern(
                regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*\\W).{8,20}$",
                message = "비밀번호는 영문자, 숫자, 특수문자를 포함한 8~20자리."
        )
        private String password;
    }


    @Getter
    @AllArgsConstructor
    public static class FindPwByEmailAndPhone {

        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Pattern(regexp = "^\\d{3}-\\d{4}-\\d{4}$", message = "전화번호 형식은 010-1234-5678이어야 합니다.")
        private String phoneNumber;


    }
    @Getter
    @AllArgsConstructor
    public static class FindPwToEmail {

        @NotBlank
        @Email
        private String email;

    }




}
