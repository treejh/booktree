package com.example.booktree.user.controller;


import com.example.booktree.blog.dto.request.BlogRequestDto;
import com.example.booktree.blog.dto.response.BlogResponseDto;
import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.user.dto.request.UserLoginRequestDto;
import com.example.booktree.user.dto.request.UserPasswordRequestDto;
import com.example.booktree.user.dto.request.UserPatchRequestDto;
import com.example.booktree.user.dto.request.UserPhoneNumberRequestDto;
import com.example.booktree.user.dto.request.UserPostRequestDto;
import com.example.booktree.user.dto.response.UserLoginResponseDto;
import com.example.booktree.user.dto.response.UserProfileResponseDto;
import com.example.booktree.user.dto.response.UserResponseDto;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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

    // Read
    //토큰으로 유저 조회
    @GetMapping("/get/{userId}")
    public ResponseEntity getUserByUserId(@PathVariable("userId") Long userId) {
        UserProfileResponseDto response = new UserProfileResponseDto(userService.findById(userId));
        return new ResponseEntity<>(response, HttpStatus.OK);
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
        UserProfileResponseDto response = new UserProfileResponseDto(userService.updateEmail(email));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    //update username
    @PatchMapping("/patch/username")
    public ResponseEntity patchUsername(@Valid @RequestParam String username ) {
        UserProfileResponseDto response = new UserProfileResponseDto(userService.updateEmail(username));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Update
    @PatchMapping("/patch/pw")
    public ResponseEntity patchPw(@RequestBody UserPasswordRequestDto userPasswordRequestDto) {
        UserProfileResponseDto response = new UserProfileResponseDto(userService.updatePw(userPasswordRequestDto));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // Update
    @PatchMapping("/patch/phoneNumber")
    public ResponseEntity patchPhoneNumber(@RequestBody UserPhoneNumberRequestDto userPhoneNumberRequestDto) {
        UserProfileResponseDto response = new UserProfileResponseDto(userService.updatePhoneNumber(userPhoneNumberRequestDto));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    // Delete
    @DeleteMapping("/delete")
    public ResponseEntity deleteBlog() {
        userService.deleteUser();
        return new ResponseEntity<>("삭제가 완료되었습니다.", HttpStatus.OK);

    }

    @PostMapping("/login")
    public ResponseEntity login(HttpServletResponse response, @RequestBody UserLoginRequestDto userLoginRequestDto){

        User user = userService.findByUserEmail(userLoginRequestDto.getEmail());

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
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Authorization header is missing or invalid");
        }

        String token = authorization.substring(7); // "Bearer " 제거

        // accessToken 쿠키 삭제
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setPath("/");  // 쿠키의 경로 지정
        accessTokenCookie.setMaxAge(0);  // 쿠키의 유효 기간을 0으로 설정하여 삭제
        response.addCookie(accessTokenCookie);

        return ResponseEntity.ok("로그아웃 완료");
    }



}




