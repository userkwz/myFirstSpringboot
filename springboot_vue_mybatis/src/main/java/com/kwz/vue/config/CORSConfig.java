package com.kwz.vue.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import static org.springframework.web.cors.CorsConfiguration.ALL;
/**
 * Created by kwz on 2018/6/4.
 */
@Configuration
    public class CORSConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return  new WebMvcConfigurerAdapter(){

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/***")
                        .allowedHeaders(ALL)
                        .allowedMethods(ALL)
                        .allowedOrigins(ALL)
                        .allowCredentials(true);
            }
        };
    }
}
