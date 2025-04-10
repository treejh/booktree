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

    @NotNull
    @NotBlank
    @Column(nullable = false, length = 255)
    private String password;

    @NotNull
    @NotBlank
    @Column(name = "phone_number", nullable = false, length = 255)
    private String phoneNumber;

    @Column(length = 20)
    private String username;

    @Column(name = "sso_provider", length = 50)
    private String ssoProvider;

    @Column(name = "social_id", length = 255)
    private String socialId;

    @Column(name = "refresh_token", length = 255)
    private String refreshToken;

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<Blog> blogList = new ArrayList<>();




    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<Category> categoryList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<LikeComment> likeCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<LikeReply> likeReplyList = new ArrayList<>();



}
