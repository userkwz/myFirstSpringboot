package com.kwz.vue.service;

import com.kwz.vue.domain.Account;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by kwz on 2018/6/4.
 */
public interface AccountService {
     List<Account> selectUserById();
}
