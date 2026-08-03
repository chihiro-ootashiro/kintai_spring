package com.example.demo.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.model.LoginUser;

@Mapper
public interface UserMapper {
	
	/**
	 * ログインユーザ検索
	 */

	public LoginUser findByLoginId(String loginId);
	
	/*
	 * 社員一覧取得
	 */
	public List<LoginUser>findMany(LoginUser searchForm);
	
//	/** ② 1件詳細取得 */
//    public LoginUser findOne(Integer id);
//
//    /** ③ 1件登録 */
//    public int insertOne(LoginUser loginUser);
//
//    /** ④ 1件更新 */
//    public int updateOne(LoginUser loginUser);
//
//    /** ⑤ 1件削除 */
//    public int deleteOne(LoginUser loginUser);
}
