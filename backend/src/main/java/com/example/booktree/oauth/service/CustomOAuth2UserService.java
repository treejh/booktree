package com.example.booktree.oauth.service;


import com.example.booktree.oauth.domain.SecurityUser;
import com.example.booktree.user.entity.User;
import com.example.booktree.user.service.UserService;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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

        //카카오에서 받아온 닉네임
        String nickname = attributesProperties.get("nickname");

        //카카오에서 이메일을 받아올 수 없기 때문에, 만들어서 넣어준다.
        String email =providerTypeCode+"__"+oauthId;

        User user = userService.modifyOrJoins(email,nickname,providerTypeCode,oauthId);


        //로그인 했다고 알리기 위해
        return new SecurityUser(
                user.getId(),
                user.getEmail(),
                " ",
                user.getUsername(),
                user.getAuthorities(user.getRole())
        );


    }



    }



