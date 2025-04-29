package com.example.booktree.email.service;

import com.example.booktree.email.entity.EmailMessage;
import com.example.booktree.user.service.UserService;
import com.example.booktree.utils.CreateRandomNumber;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.context.Context;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    @Autowired
    @Qualifier("gmailMailSender") // Gmail로 보내고 싶을 때
    private JavaMailSender gmailSender;

    @Autowired
    @Qualifier("naverMailSender") // 네이버로 보내고 싶을 때
    private JavaMailSender naverSender;

    private final SpringTemplateEngine templateEngine;


    public String sendMail(EmailMessage emailMessage, String type, String mailType,String pw) {
        JavaMailSender mailSender;
        if ("gmail".equalsIgnoreCase(mailType)) {
            mailSender = gmailSender;
        } else if ("naver".equalsIgnoreCase(mailType)) {
            mailSender = naverSender;
        } else {
            log.error("지원하지 않는 메일 타입: {}", mailType);
            throw new IllegalArgumentException("지원하지 않는 메일 타입입니다: " + mailType);
        }
        if (mailSender == null) {
            throw new IllegalArgumentException("지원하지 않는 메일 타입: " + type);
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();


        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(emailMessage.getTo());
            mimeMessageHelper.setSubject(emailMessage.getSubject());
            mimeMessageHelper.setText(setContext(pw, type), true);
            mailSender.send(mimeMessage);

            log.info("Success");
            return pw;

        } catch (MessagingException e) {
            log.info("fail");
            throw new RuntimeException(e);
        }
    }


    public String setContext(String code, String type) {
        Context context = new Context();
        context.setVariable("code", code);
        return templateEngine.process(type, context);
    }
}
