package com.example.booktree.blog.entity;


import com.example.booktree.auditable.Auditable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name="blogs")
@Getter
@Setter
@AllArgsConstructor //회원 팔로우 역할
@NoArgsConstructor
@SuperBuilder
@ToString
@NotNull
@NotBlank
public class Blog extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


}
