package com.example.booktree.oauth.service;


import com.example.booktree.oauth.domain.SecurityUser;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import com.example.booktree.utils.CreateRandomNumber;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


//loadUser를 통해서 소셜 로그인이 성공 될때 소셜 로그인 유저 정보가 데이터베이스에 저장되고, 시큐리티 객체에도 저장
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserService userService;
    //소셜 로그인이 성공할때마다 이 함수가 실행된다.
    @Transactional
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest){
        OAuth2User oAuth2User = super.loadUser(userRequest);

        //oauth2에 대한 고유 아이디
        String oauthId = oAuth2User.getName();

        String providerTypeCode = userRequest
                .getClientRegistration()
                .getRegistrationId()
                .toUpperCase(Locale.getDefault());

        Map<String, Object> attributes = oAuth2User.getAttributes();
        Map<String,String> attributesProperties = (Map<String,String>) attributes.get("properties");
        String nickname = null;
        if (providerTypeCode.equals("KAKAO")) {
            nickname = attributesProperties.get("nickname");
        } else if (providerTypeCode.equals("GITHUB")) {
           nickname = (String) attributes.get("login");
            if(nickname == null || nickname.isEmpty()){
                nickname = (String) attributes.get("name");
            }
        }

        if(nickname == null || nickname.isEmpty()){
            nickname = CreateRandomNumber.randomNumber();
        }

        String email =providerTypeCode+"__"+oauthId;

        Optional<User> validUser = userService.findBySocialIdAndSsoProvider(oauthId,providerTypeCode);

        //만약 회원이 존재한다면 -> 회원가입이 된 사용자라면 ?
        User user;
        if (validUser.isPresent()) {
            user = validUser.get();
        } else {
            user = userService.modifyOrJoins(email, nickname, providerTypeCode, oauthId);

        }


        return new SecurityUser(
                user.getId(),
                user.getEmail(),
                " ",
                user.getUsername(),
                user.getAuthorities(user.getRole()));



    }



    }



