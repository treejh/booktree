package com.example.booktree.oauth.app;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class AppConfig {
     @Getter
     private static ObjectMapper objectMapper;
 
     @Autowired
     public void setObjectMapper(ObjectMapper objectMapper) {
         AppConfig.objectMapper = objectMapper;
     }
 
     @Getter
     private static String siteFrontUrl;
 
     @Value("${custom.site.frontUrl}")
     public void setSiteFrontUrl(String siteFrontUrl) {
         AppConfig.siteFrontUrl = siteFrontUrl;
     }
 
     public static boolean isNotProd() {
         return true;
     }
 }