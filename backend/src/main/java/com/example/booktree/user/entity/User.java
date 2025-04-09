package com.example.booktree.user.entity;


import com.example.booktree.auditable.Auditable;
import com.example.booktree.category.entity.Category;
import com.example.booktree.image.entity.Image;
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




    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<Category> categoryList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<LikeComment> likeCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<LikeReply> likeReplyList = new ArrayList<>();


}
