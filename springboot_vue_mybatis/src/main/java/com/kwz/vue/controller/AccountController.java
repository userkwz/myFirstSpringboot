package com.kwz.vue.controller;

import com.kwz.vue.domain.Account;
import com.kwz.vue.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.List;

/**
 * Created by kwz on 2018/6/4.
 */
@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;
@RequestMapping("/singIn")
    public String  getUser(){
    List<Account> accountList=accountService.selectUserById();
    String name="";
    for (Account a:accountList
         ) {
        name = a.getName();
    }
    System.out.println(name);
    return name;
}

    public static void main(String[] args) {
        try {
            File file =new File(ResourceUtils.getURL("classpath:static").getPath());
            System.out.println(file.getAbsolutePath());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
