package com.kwz.vue;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * Created by kwz on 2018/6/26.
 */
@Configuration
@PropertySource("classpath:Config/web.properties")
public class Te {
    @Value("${DZJZPF}")
    private static String DZJZPF;
    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholderConfigurer(){
        return new PropertySourcesPlaceholderConfigurer();
    }
    public static void out(){
        System.out.println(DZJZPF);
    }
}
