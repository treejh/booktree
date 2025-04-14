package com.example.booktree.oauth.domain;

import com.example.booktree.user.entity.User;
import java.util.Collection;
import java.util.Map;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class SecurityUser extends User implements OAuth2User {
    @Getter
    private Long id;

    @Getter
    private String username;

    @Getter
    private String email;



    public SecurityUser(
            long id,
            String email,
            String password,
            String username,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super(id, email, username,authorities);
        this.id = id;
        this.username = username;
        this.email= email;
    }

    @Override
    public <A> A getAttribute(String name) {
        return OAuth2User.super.getAttribute(name);
    }

    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    @Override
    public String getName() {
        return getUsername();
    }

}