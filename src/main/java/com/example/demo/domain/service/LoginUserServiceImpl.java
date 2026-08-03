package com.example.demo.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.domain.model.LoginUser;
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
	public List<LoginUser> getLoginUserList(LoginUser searchForm) {
		return mapper.findMany(searchForm);
	}
	
//	 /** ② 社員詳細取得 */
//    @Override
//    public LoginUser getLoginUser(Integer id) {
//        return mapper.findOne(id);
//    }
//
//    /** ③ 社員登録処理 */
//    @Override
//    public int createLoginUser(LoginUser loginUser) {
//        return mapper.insertOne(loginUser);
//    }
//
//    /** ④ 社員更新処理 */
//    @Override
//    public int updateLoginUser(LoginUser loginUser) {
//        return mapper.updateOne(loginUser);
//    }
//
//    /** ⑤ 社員削除処理 */
//    @Override
//    public int deleteLoginUser(LoginUser loginUser) {
//        return mapper.deleteOne(loginUser);
//    }
}
