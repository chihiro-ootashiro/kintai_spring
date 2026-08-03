package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	/**
	 * パスワードを暗号化用メソッド
	 */
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	/**
	 * ログイン
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.formLogin(login -> login
				//ログイン認証処理URL
				.loginProcessingUrl("/login")
				.loginPage("/login")
				//ログイン成功後の遷移先（勤怠管理画面に遷移）
				.defaultSuccessUrl("/kintai/index", true)
				//ログイン失敗後の遷移先
				.failureUrl("/login/error")
				//ログインフォームでのユーザIDとパスワードのname
				.usernameParameter("login_id")
				.passwordParameter("password")
				.permitAll()).logout(logout -> logout
						// ログアウト後の遷移先
						.logoutSuccessUrl("/login"))
				.authorizeHttpRequests(ahr -> ahr
						// 静的ファイルが認証なしでアクセス可能
						//今回は未認証時にユーザ登録画面への遷移を出来ないようにしてくださいなので（"/")は書かない
						.requestMatchers("/css/**", "/js/**", "/assets/**", "/favicon.ico").permitAll()
						// 認可用：権限が無いと利用できない
						.requestMatchers("/kintai/employee/**", "/api/employee/**").hasRole("ADMIN") // 管理者(1)のみ	
						.requestMatchers("/kintai/**").hasAnyRole("GENERAL", "ADMIN") // 全員(0と1)がアクセス可能
						// 他のリンクは全て認証が必要
						.anyRequest().authenticated());

		return http.build();
	}
}
