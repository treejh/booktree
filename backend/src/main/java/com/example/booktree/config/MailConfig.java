package com.example.booktree.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {


    @Value("${custom-mail.gmail.username}")
    private String gmailUsername;

    @Value("${custom-mail.gmail.password}")
    private String gmailPassword;

    @Value("${custom-mail.naiver.username}")
    private String naverUsername;

    @Value("${custom-mail.naiver.password}")
    private String naverPassword;

    @Bean
    public JavaMailSender gmailMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername(gmailUsername);
        mailSender.setPassword(gmailPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", true);
        props.put("mail.smtp.starttls.enable", true);



        return mailSender;
    }

    @Bean
    public JavaMailSender naverMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.naver.com");
        mailSender.setPort(465);
        mailSender.setUsername(naverUsername);
        mailSender.setPassword(naverPassword);


        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", true);
        props.put("mail.smtp.ssl.enable", true);
        props.put("mail.smtp.ssl.trust", "smtp.naver.com");

        return mailSender;
    }
}
