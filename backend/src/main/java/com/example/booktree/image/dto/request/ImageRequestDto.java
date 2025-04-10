package com.example.booktree.image.dto.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;


@Getter
@Setter
@AllArgsConstructor
public class ImageRequestDto {

    private Long postId;
    private List<MultipartFile> images;

}
