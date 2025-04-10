package com.example.booktree.handler;

import com.example.booktree.exception.BusinessLogicException;
import com.example.booktree.exception.ExceptionCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;
@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<String> handleBusinessLogicException(BusinessLogicException e) {
        // 콘솔에만 로그 출력
        log.info("예외가 발생   : " + e.getExceptionCode().getMessage());

        // 클라이언트(curl 등)에는 메시지만 응답
        return ResponseEntity
                .status((int) e.getExceptionCode().getStatus()) // 예외 코드에 맞는 상태코드
                .body(e.getExceptionCode().getMessage());
    }



}
