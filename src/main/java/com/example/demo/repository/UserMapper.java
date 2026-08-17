package com.example.demo.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.demo.domain.entity.LoginUser;
import com.example.demo.form.EmployeeSearchForm;

@Mapper
public interface UserMapper {
	
	/**
	 * ログインユーザ検索
	 */
	public LoginUser findByLoginId(String loginId);
	
	/*
	 * 社員一覧取得
	 */
	public List<LoginUser>findMany(EmployeeSearchForm searchForm);
	

    /** 1件登録 */
    public int insertOne(LoginUser loginUser);

    /** 1件更新 */
    public int updateOne(LoginUser loginUser);

    /** 1件削除 */
    public int deleteOne(String employeeNo);
    
    /**
	 * 社員番号から社員情報を1件取得
	 */
	public LoginUser findByEmployeeNo(String employeeNo);
}
