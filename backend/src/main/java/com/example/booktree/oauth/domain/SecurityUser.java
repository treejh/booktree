package com.example.booktree.oauth.domain;

import com.example.booktree.role.entity.Role;
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
            Role role,
            Collection<? extends GrantedAuthority> authorities
    ) {
        super();
        this.setId(id);
        this.setEmail(email);
        this.setPassword(password);
        this.setUsername(username);
        this.setRole(role);
    }


    @Override
    public Map<String, Object> getAttributes() {
        return Map.of();
    }

    @Override
    public String getName() {
        return getUsername();
    }

}