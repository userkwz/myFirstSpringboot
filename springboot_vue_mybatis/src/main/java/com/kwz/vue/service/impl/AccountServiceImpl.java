package com.kwz.vue.service.impl;

import com.kwz.vue.dao.AccountMapper;
import com.kwz.vue.domain.Account;
import com.kwz.vue.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by kwz on 2018/6/4.
 */
@Service
@Transactional
public class AccountServiceImpl implements AccountService {
    @Autowired
    private AccountMapper accountMapper;
    @Override
    public List<Account> selectUserById() {
        return accountMapper.selectUserById();
    }
}
