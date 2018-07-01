package com.kwz.vue.dao;

import com.kwz.vue.domain.Account;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by kwz on 2018/6/4.
 */
@Repository
public interface AccountMapper {
   List<Account> selectUserById();
}
