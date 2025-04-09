package com.example.booktree.blog.entity;


import com.example.booktree.auditable.Auditable;
import com.example.booktree.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;

@Entity
@Table(name="blogs")
@Getter
@Setter
@AllArgsConstructor //회원 팔로우 역할
@NoArgsConstructor
@SuperBuilder
@ToString
public class Blog extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @NotBlank
    @Column(length = 20, nullable = false)
    private String name; // 블로그 이름

    @Column(length = 255)
    private String profile; // 소개글(공지사항)

    @Column(length = 255)
    private String notice; // 공지사항

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 생성날짜

    @Column(name = "modified_at", nullable = false)
    private LocalDateTime modifiedAt; // 수정날짜

}
