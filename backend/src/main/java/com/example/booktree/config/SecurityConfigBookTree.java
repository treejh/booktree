package com.example.booktree.config;


import com.example.booktree.jwt.filter.JwtAuthenticationFilter;
import com.example.booktree.jwt.util.JwtTokenizer;
import com.example.booktree.oauth.handler.CustomOAuth2AuthenticationSuccessHandler;
import com.example.booktree.oauth.resolver.CustomAuthorizationRequestResolver;
import com.example.booktree.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfigBookTree {

    private final JwtTokenizer jwtTokenizer;
    private final CustomOAuth2AuthenticationSuccessHandler customOAuth2AuthenticationSuccessHandler;
    private final CustomAuthorizationRequestResolver customAuthorizationRequestResolver;



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // H2 console 용
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/api/oauth/**",
                                "/oauth2/**",
                                "/login/oauth2/code/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/h2-console/**",
                                "/api/users",
                                "/api/v1/users/find/**",
                                "/api/v1/users/get/profile/**"

                        ).permitAll()
                        //회원 /api/v1/users
                        .requestMatchers("/api/v1/users/get/profile/**", "/api/v1/users/create"
                                ,"/api/v1/users/login","/api/v1/users/find/**"

                        ).permitAll()
                        .requestMatchers("/api/v1/users/patch/**","/api/v1/users/get/token"
                        ,"/api/v1/users/logout","/api/v1/users/validation/**",
                                "/api/v1/users/delete/**")
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //대댓글 /api/v1/replies
                        .requestMatchers("/api/v1/replies/get"

                        ).permitAll()
                        .requestMatchers("/api/v1/replies/create","/api/v1/replies/update/**","/api/v1/replies/delete/**")
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //게시글 api/v1/posts
                        .requestMatchers("/api/v1/users/get/profile/**","api/v1/posts/search"
                                ,"api/v1/posts/get/**"


                        ).permitAll()
                        .requestMatchers("/api/v1/posts/create", "/api/v1/posts/patch/**",
                                "/api/v1/posts/delete/**", "/api/v1/likeposts/click/**",
                        "/api/v1/posts/get/likePost","/api/v1/posts/get/followingPost",
                               "/api/v1/posts/delete/**" )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //메인 카테고리 /api/v1/maincategories
                        .requestMatchers("/api/v1/maincategories/get"

                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/maincategories/create","/api/v1/maincategories/patch/**"
                                ,"/api/v1/maincategories/delete/**"
                        )
                        .hasAnyAuthority("ROLE_ADMIN")


                        //게시글 좋아요 /api/v1/likeposts
                        .requestMatchers("/api/v1/likeposts/get/**"

                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/likeposts/click/**"
                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //대댓글 좋아요 /api/v1/like-replies
                        .requestMatchers(
                                "/api/v1/like-replies/create"
                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //댓글 좋아요 /api/v1/like-comments
                        .requestMatchers(
                                "/api/v1/like-comments/create"
                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //팔로우 /api/v1/follow/create
                        .requestMatchers(
                                "/api/v1/follow/create/follow"
                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")


                        //댓글 /api/v1/follow/create
                        .requestMatchers("/api/v1/comments/get"

                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/comments/create/**",
                                "/api/v1/comments/update/**",
                                "/api/v1/comments/delete/**"
                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //카테고리 (개인)
                        .requestMatchers(
                            "/api/v1/categories/get/**"
                        ).permitAll()
                        .requestMatchers(
                                "/api/v1/categories/create",
                                "/api/v1/categories/patch/**",
                                "/api/v1/categories/delete/**"

                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //블로그 컨트롤러
                        .requestMatchers(
                            "/api/v1/blogs/get"
                        ).permitAll()
                        .requestMatchers(
                            "/api/v1/blogs/create/**",
                                "/api/v1/blogs/patch/**",
                                "/api/v1/blogs/delete",
                                "/api/v1/blogs/get/token"

                        )
                        .hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")

                        //실시간 전체 인기 게시글 가져오기
                        .requestMatchers(
                                "/api/v1/blogs/get"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(
                        oauth2Login -> {
                            // Configure OAuth2 login
                            oauth2Login
                                    .successHandler(customOAuth2AuthenticationSuccessHandler)
                                    .authorizationEndpoint(
                                            authorizationEndpoint ->
                                                    authorizationEndpoint
                                                            .authorizationRequestResolver(customAuthorizationRequestResolver)
                                    );
                        }
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenizer), UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .cors(cors -> cors.configurationSource(configurationSource()))

                .logout(logout -> logout
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"));


        return http.build();
    }




    //특정 포트 번호 허락
    public CorsConfigurationSource configurationSource(){
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        source.registerCorsConfiguration("/**",config);
        return source;

    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }


}
