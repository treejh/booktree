package com.example.booktree.post.entity;


import com.example.booktree.auditable.Auditable;
import com.example.booktree.category.entity.Category;
import com.example.booktree.comment.entity.Comment;
import com.example.booktree.image.entity.Image;
import com.example.booktree.maincategory.entity.MainCategory;
import com.example.booktree.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.awt.print.Book;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
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






    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<Image> imageList = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.REMOVE, orphanRemoval = false)
    List<Comment> commentList = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "main_category_id")
    private MainCategory mainCategory;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;



}
