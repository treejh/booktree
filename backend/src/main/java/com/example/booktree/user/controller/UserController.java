package com.example.booktree.user.controller;


import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.security.CustomUserDetails;
import com.example.booktree.user.dto.request.UserLoginRequestDto;
import com.example.booktree.user.dto.response.UserMyPageResponseDto;
import com.example.booktree.user.dto.request.UserPasswordRequestDto;
import com.example.booktree.user.dto.request.UserPatchRequestDto;
import com.example.booktree.user.dto.request.UserPhoneNumberRequestDto;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.dto.response.UserLoginResponseDto;
import com.example.booktree.user.dto.response.UserProfileResponseDto;
import com.example.booktree.user.dto.response.UserResponseDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import com.example.booktree.utils.dto.ApiResponseDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final JwtTokenizer jwtTokenizer;

    @PostMapping("/create")
    public ResponseEntity createMember(@Valid @RequestBody UserPostRequestDto userPostRequestDto) {
        UserResponseDto response = new UserResponseDto(userService.createUser(userPostRequestDto));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/create/admin")
    public ResponseEntity createAdmin(@Valid @RequestBody UserPostRequestDto userPostRequestDto) {
        UserResponseDto response = new UserResponseDto(userService.createAdmin(userPostRequestDto));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // Read(마이페이지 할때 사용) - 아이디로 유저 가지고 오기
    @GetMapping("/get/profile/{userId}")
    public ResponseEntity getUserByUserId(@PathVariable("userId") Long userId) {
        UserMyPageResponseDto response = new UserMyPageResponseDto(userService.findById(userId));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Read (본인 정보 수정할때 사용) - 토큰을 사용하여 유저 조회
    @GetMapping("/get/token")
    public ResponseEntity getUserByToken() {
        UserProfileResponseDto response = new UserProfileResponseDto(userService.findByToken());
        //System.out.println(response);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //요청한 비밀번호와 사용자의 비밀번호가 같은지 확인
    //페이지에서 회원 정보 수정 페이지 들어가기전에 사용하면 될듯
    @PostMapping("/validation/password")
    public ResponseEntity validationPw(@Valid @RequestBody UserPasswordRequestDto.PasswordDto passwordDto) {
        userService.validPasswordCorrect(passwordDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    // Update
    @PatchMapping("/patch")
    public ResponseEntity patchUser(@RequestBody UserPatchRequestDto userPatchRequestDto) {
        UserProfileResponseDto response = new UserProfileResponseDto(userService.updateUser(userPatchRequestDto));
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    //update email
    @PatchMapping("/patch/email")
    public ResponseEntity patchUserEmail(@Valid @RequestParam String email ) {
        userService.updateEmail(email);
        return new ResponseEntity<>("수정 완료", HttpStatus.OK);
    }

    //update username
    @PatchMapping("/patch/username")
    public ResponseEntity patchUsername(@Valid @RequestParam String username ) {
        userService.updateUserName(username);
        return new ResponseEntity<>("수정 완료", HttpStatus.OK);

    }

    // Update
    @PatchMapping("/patch/pw")
    public ResponseEntity patchPw(@Valid @RequestBody UserPasswordRequestDto userPasswordRequestDto) {
        userService.updatePw(userPasswordRequestDto);
        return new ResponseEntity<>("수정 완료", HttpStatus.OK);

    }

    // Update
    @PatchMapping("/patch/phoneNumber")
    public ResponseEntity patchPhoneNumber(@Valid @RequestBody UserPhoneNumberRequestDto userPhoneNumberRequestDto) {
        userService.updatePhoneNumber(userPhoneNumberRequestDto);
        return new ResponseEntity<>("수정 완료", HttpStatus.OK);
    }



    // Delete
    @DeleteMapping("/delete")
    public ResponseEntity deleteBlog() {
        userService.deleteUser();
        return new ResponseEntity<>("삭제 완료", HttpStatus.OK);
    }

    // Delete
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity deleteBlog(@Positive @PathVariable("userId") Long userId) {
        userService.deleteUserById(userId);
        return new ResponseEntity<>("삭제 완료", HttpStatus.OK);
    }


    @PostMapping("/login")
    public ResponseEntity login(HttpServletResponse response, @RequestBody UserLoginRequestDto userLoginRequestDto){

        User user = userService.findUserByEmail(userLoginRequestDto.getEmail());

        if(!userService.validPassword(userLoginRequestDto.getPassword(),user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String accessToken = jwtTokenizer.createAccessToken(user.getId(),user.getUsername()
                ,user.getEmail(),user.getRole().getRole().name());
        String refreshToken = jwtTokenizer.createRefreshToken(user.getId(),user.getUsername()
                ,user.getEmail(),user.getRole().getRole().name());

        user.setRefreshToken(refreshToken);
        userService.saveUser(user);

        Cookie accessTokenCookie = new Cookie("accessToken",accessToken);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");

        //분단위
        accessTokenCookie.setMaxAge(Math.toIntExact(JwtTokenizer.ACCESS_TOKEN_EXPIRE_COUNT/1000));

        response.addCookie(accessTokenCookie);


        UserLoginResponseDto userLoginResponseDto  = new UserLoginResponseDto(user,accessToken);


        return ResponseEntity.ok(userLoginResponseDto);

    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String authorization, HttpServletResponse response) {
//        if (authorization == null || !authorization.startsWith("Bearer ")) {
//            return ResponseEntity.badRequest().body("Authorization header is missing or invalid");
//        }

        //String token = authorization.substring(7); // "Bearer " 제거

        // accessToken 쿠키 삭제
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");  // 쿠키의 경로 지정
        accessTokenCookie.setMaxAge(0);  // 쿠키의 유효 기간을 0으로 설정하여 삭제
        response.addCookie(accessTokenCookie);

        return ResponseEntity.ok("로그아웃 완료");
    }



    //핸드폰 번호로 이메일 찾기
    @PostMapping("/find/email/phone")
    public ResponseEntity findEmailByPhoneNumber(@Valid @RequestBody UserPhoneNumberRequestDto userPhoneNumberRequestDto) {
        String email = userService.findEmailByPhoneNumber(userPhoneNumberRequestDto) ;
        ApiResponseDto response = ApiResponseDto.builder()
                .data(email)
                .message("이메일 입니다.")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/find/pw/phone")
    public ResponseEntity findPwByPhoneNumber(@Valid @RequestBody UserPhoneNumberRequestDto userPhoneNumberRequestDto) {
        String password = userService.findPasswordByPhoneNumber(userPhoneNumberRequestDto.getPhoneNumber()) ;
        ApiResponseDto response = ApiResponseDto.builder()
                .data(password)
                .message("임시 비밀번호 입니다.")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/find/pw/email")
    public ResponseEntity findPwByEmail(@Valid @RequestParam String email) {
        String password = userService.findPasswordByEmail(email) ;
        ApiResponseDto response = ApiResponseDto.builder()
                .data(password)
                .message("임시 비밀번호 입니다.")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    //만약 oauth 로그인 후 추가정보를 받아야 할 수 있기 때문에 혹시 몰라서 만든 메서드
    @PostMapping("/api/v1/users/extra-info")
    public ResponseEntity<?> updateExtraInfo(@Valid@RequestBody UserPhoneNumberRequestDto userPhoneNumberRequestDto, @AuthenticationPrincipal CustomUserDetails user) {
        userService.updateExtraInfo(user.getUserId(), userPhoneNumberRequestDto);
        return ResponseEntity.ok().build();
    }



    //이메일, 핸드폰 번호로 비밀번호 찾기
    @PostMapping("/find/pw/emailAndPhone")
    public ResponseEntity findPwByEmailAndPhone(@Valid @RequestBody UserPasswordRequestDto.FindPwByEmailAndPhone findPwByEmailAndPhone) {
        String password = userService.findPasswordByEmailAndPhone(findPwByEmailAndPhone) ;
        ApiResponseDto response = ApiResponseDto.builder()
                .data(password)
                .message("임시 비밀번호 입니다.")
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}




