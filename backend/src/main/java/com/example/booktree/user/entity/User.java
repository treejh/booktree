package com.example.booktree.user.entity;


import com.example.booktree.auditable.Auditable;
import com.example.booktree.blog.entity.Blog;
import com.example.booktree.category.entity.Category;
import com.example.booktree.like_comment.entity.LikeComment;
import com.example.booktree.like_reply.entity.LikeReply;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import com.example.booktree.role.entity.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Entity
@Table(name="users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotNull
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;


    @NotNull
    @NotBlank
    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(name = "phone_number", length = 255)
    private String phoneNumber;

    @Column(length = 20)
    private String username;

    //oauth에서 제공된 user 식별 아이디
    @Column(name = "social_id", length = 255)
    private String socialId;

    //사용된 oauth 이름, kakao, naver.
    @Column(name = "sso_provider", length = 50)
    private String ssoProvider;


    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false,  fetch = FetchType.EAGER)
    List<Blog> blogList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false,  fetch = FetchType.EAGER)
    List<Category> categoryList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false,  fetch = FetchType.EAGER)
    List<LikeComment> likeCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false,  fetch = FetchType.EAGER)
    List<LikeReply> likeReplyList = new ArrayList<>();

    public User(long id, String email, String username, Collection<? extends GrantedAuthority> authorities) {
        this.id=id;
        this.email = email;
        this.username=username;
    }


    public List<String> getAuthoritiesAsStringList(String role) {
        List<String> authorities = new ArrayList<>();
        authorities.add("ROLE_" + role); // 또는 role.getRoleType().name()
        return authorities;
    }


    public Collection<? extends GrantedAuthority> getAuthorities(Role role) {
        return getAuthoritiesAsStringList(role.getRole().toString())
                .stream()
                .map(SimpleGrantedAuthority::new)
                .toList();
    }


}
