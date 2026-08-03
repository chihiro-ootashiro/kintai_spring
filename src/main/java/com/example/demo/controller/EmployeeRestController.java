package com.example.demo.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.demo.domain.model.LoginUser;
import com.example.demo.domain.service.LoginUserService;

@Controller
@RequestMapping("/api/employee")
public class EmployeeRestController {
	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private LoginUserService loginUserService;

	@Autowired
	private PasswordEncoder passwordEncoder; // パスワード暗号化するやつ

	/**
	    * 社員一覧取得
	    */
	@GetMapping("/index")
	public List<LoginUser> getIndex() {
		return loginUserService.getLoginUserList(null);
	}
	
//	/**
//     * ② 社員詳細取得 (REST API)
//     */
//    @GetMapping("/detail/{id}")
//    public LoginUser getDetail(@PathVariable("id") Integer id) {
//        // 指定されたIDの社員データをReactへ返します
//        return loginUserService.getLoginUser(id);
//    }
//
//    /**
//     * ③ 社員登録処理 (REST API)
//     */
//    @PostMapping("/create")
//    public int postCreate(@RequestBody LoginUser loginUser) {
//        // 🔒 要件：パスワードを暗号化して登録
//        String encodedPassword = passwordEncoder.encode(loginUser.getPassword());
//        loginUser.setPassword(encodedPassword);
//
//        // データベースに登録を実行して、結果（1など）を返す
//        return loginUserService.createLoginUser(loginUser);
//    }
//
//    /**
//     * ④ 社員更新処理 (REST API)
//     */
//    @PutMapping("/update")
//    public int postUpdate(@RequestBody LoginUser loginUser) {
//        // 過去コードのロジック：パスワードが入力されていない場合は元のパスワードを維持する
//        if (loginUser.getPassword() == null || loginUser.getPassword().isEmpty()) {
//            LoginUser originUser = loginUserService.getLoginUser(loginUser.getId());
//            loginUser.setPassword(originUser.getPassword());
//        } else {
//            // 🔒 要件：新しいパスワードが入力された場合は暗号化して更新
//            String encodedPassword = passwordEncoder.encode(loginUser.getPassword());
//            loginUser.setPassword(encodedPassword);
//        }
//
//        // データベースの更新を実行
//        return loginUserService.updateLoginUser(loginUser);
//    }
//
//    /**
//     * ⑤ 社員削除処理 (REST API)
//     */
//    @DeleteMapping("/delete/{id}")
//    public int postDelete(@PathVariable("id") Integer id) {
//        LoginUser loginUser = new LoginUser();
//        loginUser.setId(id);
//        // データベースから削除を実行
//        return loginUserService.deleteLoginUser(loginUser);
//    }
}
