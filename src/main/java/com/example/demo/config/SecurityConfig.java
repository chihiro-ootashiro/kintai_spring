package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

@Configuration
public class SecurityConfig {

	@Autowired
	private LoginHandler customLoginSuccessHandler;

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
				//ログイン成功後の遷移先（ログインハンドラーで動的に遷移）
				.successHandler(customLoginSuccessHandler)
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
						.requestMatchers("/employee/index").hasRole("ADMIN") // 社員マスタ画面は管理者(ADMIN)のみアクセス可能
						.requestMatchers("/api/employee/create").hasRole("ADMIN")//登録は管理者のみ
						.requestMatchers("/api/employee/update").hasRole("ADMIN")//登録は管理者のみ
						.requestMatchers("/employee/input").hasAnyRole("GENERAL", "ADMIN") // 勤怠入力画面は全員がアクセス可能
						.requestMatchers("/attendance/**").hasRole("ADMIN")//勤怠管理画面は管理者のみ
						.requestMatchers("/holiday/**").hasRole("ADMIN")//祝日マスタは管理者のみ
						.requestMatchers("/employee/api/holidays").permitAll() 
						// 他のリンクは全て認証が必要
						.anyRequest().authenticated())

				.csrf(csrf -> csrf
						.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
						// ヘッダーの「X-XSRF-TOKEN」をそのまま正しく検証させるための指定
						.csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()));

		return http.build();
	}
}
