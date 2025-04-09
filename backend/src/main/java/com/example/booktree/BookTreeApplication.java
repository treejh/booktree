package com.example.booktree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class BookTreeApplication {
    public static void main(String[] args) {
        SpringApplication.run(BookTreeApplication.class, args);
    }

}
