package com.example.booktree.security;

import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomUserDetails implements UserDetails {


    private final String email;
    @Getter
    private final Long userId;
    private final String password;
    private final List<GrantedAuthority> authorities;

    public CustomUserDetails(String password, String email, Long userId,List<GrantedAuthority> roles) {
        this.email = email;
        this.userId = userId;
        this.password = password;
        this.authorities = roles;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }


    //사용자가 만료 됐는가?
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    //사용자가 활성화가 됐는가 ?
    @Override
    public boolean isEnabled() {
        return true;
    }
}
