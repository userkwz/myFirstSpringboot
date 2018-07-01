package com.kwz.vue;

import com.kwz.vue.utils.ConfigUtils;
/**
 * Created by kwz on 2018/6/26.
 */
public class Test {
   @org.junit.Test

    public void tets(){
      String s = ConfigUtils.getConfig("Config/Web.properties","DZJZPF");
       System.out.println(s);
   }
}
