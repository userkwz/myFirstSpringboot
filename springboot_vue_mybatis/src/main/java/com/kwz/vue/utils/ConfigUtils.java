package com.kwz.vue.utils;
import org.springframework.util.ResourceUtils;
import java.io.*;
import java.util.Properties;

/**
 * Created by kwz on 2018/6/26.
 */
/*@Configuration
@PropertySource("classpath:Config/web.properties")*/
public class ConfigUtils {
/*    @Value("${DZJZPF}")
    private static String DZJZPF;
    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholderConfigurer(){
        return new PropertySourcesPlaceholderConfigurer();
}*/

    public static String getConfig(String configFilePath,String str){
        Properties p =null;
        if (p==null){
            p = new Properties();
            try {
                p.load(new BufferedReader(new InputStreamReader(new FileInputStream(getConfigPath(configFilePath)),"UTF-8")));
                return p.getProperty(str).trim();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
 public static String getConfigPath(String path){
     String rootPath="";
     try {
         File file =new File(ResourceUtils.getURL("classpath:static/"+path).getPath());
         rootPath =file.getAbsolutePath();
     } catch (FileNotFoundException e) {
         e.printStackTrace();
     }
     return rootPath;
 }
}
