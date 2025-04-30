package com.example.booktree.likepost.entity;

import com.example.booktree.auditable.Auditable;
import com.example.booktree.post.entity.Post;
import com.example.booktree.user.entity.User;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "like_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LikePost extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}
