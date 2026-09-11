package com.example.demo.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.entity.LoginUser;
import com.example.demo.form.EmployeeSearchForm;
import com.example.demo.repository.UserMapper;

@Service
@Transactional
public class LoginUserServiceImpl implements LoginUserService {
	@Autowired
	private UserMapper mapper;

	/*
	 * ログインユーザ検索
	 */
	@Override
	public LoginUser getUserByLoginId(String loginId) {
		return mapper.findByLoginId(loginId);
	}

	/**
	 * 社員一覧取得
	 */
	@Override
	public List<LoginUser> getLoginUserList(EmployeeSearchForm searchForm) {
		return mapper.findMany(searchForm);
	}
	

    /** 社員登録処理 */
    @Override
    public int createLoginUser(LoginUser loginUser) {
        return mapper.insertOne(loginUser);
    }

    /** 社員更新処理 */
    @Override
    public int updateLoginUser(LoginUser loginUser) {
        return mapper.updateOne(loginUser);
    }

    /** 社員削除処理 */
    @Override
    public int deleteLoginUser(String employeeNo) {
    	 return mapper.deleteOne(employeeNo);
    }
    
	@Override
	public LoginUser getUserByEmployeeNo(String employeeNo) {
		return mapper.findByEmployeeNo(employeeNo);
	}
}
