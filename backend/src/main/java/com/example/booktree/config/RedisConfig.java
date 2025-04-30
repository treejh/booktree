//package com.example.booktree.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.StringRedisTemplate;
//
//@Configuration
//public class RedisConfig {
//
//
//    @Value("${spring.data.redis.host}")
//    private String redisHost;
//
//    @Value("${spring.data.redis.port}")
//    private int redisPort;
//
//    @Value("${spring.data.redis.password:}") // password가 비어있을 수도 있으니까 기본값은 빈 문자열로
//    private String redisPassword;
//
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory() {
//        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisHost, redisPort);
//        if (!redisPassword.isBlank()) {
//            factory.setPassword(redisPassword);
//        }
//        return factory;
//    }
//
//    @Bean
//    public StringRedisTemplate redisTemplate(RedisConnectionFactory connectionFactory) {
//        return new StringRedisTemplate(connectionFactory);
//    }
//
//}
