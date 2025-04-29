package com.example.booktree.reply.entity;


import com.example.booktree.auditable.Auditable;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.likereply.entity.LikeReply;
import com.example.booktree.user.entity.User;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name="replies")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@ToString
public class Reply extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String content;
    
    // 부모 댓글이 있어야 함
    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;
    
    
    // 대댓글작성자
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "reply", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<LikeReply> likeReplyList = new ArrayList<>();

    // 새로 추가
    public long getLikeCount() {
        return likeReplyList != null ? likeReplyList.size() : 0L;
    }
}
