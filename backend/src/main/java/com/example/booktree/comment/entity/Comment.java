package com.example.booktree.comment.entity;


import com.example.booktree.auditable.Auditable;
import com.example.booktree.like_comment.entity.LikeComment;
import com.example.booktree.post.entity.Post;
import com.example.booktree.reply.entity.Reply;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name="comments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Comment extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<LikeComment> likeCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "comment", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<Reply> replyList = new ArrayList<>();

}
