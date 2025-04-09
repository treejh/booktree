package com.example.booktree.user.entity;


import com.example.booktree.auditable.Auditable;
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
    @NotBlank
    @ManyToOne(fetch = FetchType.LAZY)
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

    
}
