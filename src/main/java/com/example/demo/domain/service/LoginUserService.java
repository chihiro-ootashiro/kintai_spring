package com.example.demo.domain.service;

import java.util.List;

import com.example.demo.domain.model.LoginUser;

public  interface LoginUserService {
	
	/*
	 * ログインユーザ検索
	 */
	public LoginUser getUserByLoginId(String loginId);
	
	/**
	 * 社員一覧取得
	 */
	public List<LoginUser> getLoginUserList(LoginUser searchFrom);
	
//	/** 👤 ② 社員詳細取得 */
//    public LoginUser getLoginUser(Integer id);
//
//    /** 👤 ③ 社員登録処理 */
//    public int createLoginUser(LoginUser loginUser);
//
//    /** 👤 ④ 社員更新処理 */
//    public int updateLoginUser(LoginUser loginUser);
//
//    /** 👤 ⑤ 社員削除処理 */
//    public int deleteLoginUser(LoginUser loginUser);
}
