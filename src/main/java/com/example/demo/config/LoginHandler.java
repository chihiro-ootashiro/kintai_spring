package com.example.demo.config;

import java.io.IOException;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoginHandler implements AuthenticationSuccessHandler {

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		// 1. ログインしたユーザーの権限を取得する
		Set<String> roles = AuthorityUtils.authorityListToSet(authentication.getAuthorities());

		// 分岐
		if (roles.contains("ROLE_ADMIN")) {
			// 管理ユーザの場合：いったん社員マスタ画面に
			// 勤怠管理画面ができたら、ここをそのURL（例: "/admin/attendance"）に書き換える
			response.sendRedirect("/employee/index");
		} else {
			// 一般ユーザの場合：勤怠入力画面に遷移させます
			response.sendRedirect("/employee/input");
		}
	}
}
