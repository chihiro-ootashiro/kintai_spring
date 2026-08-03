package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.domain.model.LoginUser;
import com.example.demo.domain.service.LoginUserService;

@Service
public class LoginUserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private LoginUserService service;
	
	@Override
	public UserDetails loadUserByUsername(String loginId) throws
	UsernameNotFoundException {
		
		//ログインユーザを検索
		LoginUser loginUser = service.getUserByLoginId(loginId);
		
		//存在しない場合はExcepttionを返す
		if(loginUser == null) {
			throw new UsernameNotFoundException("User not found: " + loginId);	
		}
		
		//権限を数字から文字列に変換
		String roleName = (loginUser.getRoleCd() == 1)?"ADMIN":"GENERAL";
		
	//クエリからspring　sequrityのUserDetailsクラスを作成
		return User.withUsername(loginUser.getEmployeeNo())//ユーザ名
				.password(loginUser.getPassword())//パスワード
				.roles(roleName)//権限
				.build();
	}
	
}
