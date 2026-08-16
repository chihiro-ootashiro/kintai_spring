package com.example.demo.domain.service;
import java.util.List;

import com.example.demo.domain.entity.LoginUser;
import com.example.demo.form.EmployeeSearchForm;

public  interface LoginUserService {
	
	/*
	 * ログインユーザ検索
	 */
	public LoginUser getUserByLoginId(String loginId);
	
	/**
	 * 社員一覧取得
	 */
	public List<LoginUser> getLoginUserList(EmployeeSearchForm form);
	
    /** 社員登録処理 */
    public int createLoginUser(LoginUser loginUser);

    /** 社員更新処理 */
    public int updateLoginUser(LoginUser loginUser);

    /** 社員削除処理 */
    public int deleteLoginUser(String employeeNo);
}
