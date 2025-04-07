package com.blog.booktree

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BookTreeApplication

fun main(args: Array<String>) {
    runApplication<BookTreeApplication>(*args)
}
