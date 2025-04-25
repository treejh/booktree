package com.example.booktree.post.entity;

import com.example.booktree.auditable.Auditable;
import com.example.booktree.blog.entity.Blog;
import com.example.booktree.category.entity.Category;
import com.example.booktree.image.entity.Image;
import com.example.booktree.like_comment.entity.LikeComment;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name="posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Post extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.EAGER) //수정
    @JoinColumn(name = "main_category_id", nullable = false)
    private MainCategory mainCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog; //블로그아이디

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; //회원아이디

    @NotBlank
    @Column(length = 50, nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false)
    private String content;

    @Column(length = 100)
    private String author;

    @Column(length = 100)
    private String book;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long view = 0L; //조회수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category; //개인 카테고리


    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    List<Image> imageList = new ArrayList<>();



    // 게시글 좋아요 필드 추가
    @Builder.Default
    @Column(name = "like_count", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long likeCount = 0L;

}