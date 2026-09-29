package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.domain.entity.LoginUser;
import com.example.demo.domain.model.EmployeeModel;
import com.example.demo.domain.service.LoginUserService;
import com.example.demo.form.EmployeeCreateForm;
import com.example.demo.form.EmployeeSearchForm;
import com.example.demo.form.EmployeeUpdateForm;

@RestController
@CrossOrigin(origins = "*")
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
	public List<EmployeeModel> getIndex(EmployeeSearchForm form) {

		//  サービス経由でDBからエンティティのリストを取得
		List<LoginUser> entityList = loginUserService.getLoginUserList(form);

		//  ModelMapper を使って EmployeeModel のリストに詰め替え
		List<EmployeeModel> modelList = entityList.stream()
				.map(entity -> {
					// ModelMapper呼び出し
					EmployeeModel model = modelMapper.map(entity, EmployeeModel.class);

					// DBから取れた権限コードを見て、権限名をつけなおす
					if (model.getRoleCd() != null) {
						if (model.getRoleCd() == 1) {
							model.setRoleName("管理者");
						} else if (model.getRoleCd() == 0) {
							model.setRoleName("一般");
						}
					}

					return model;
				})
				.collect(Collectors.toList());

		// 3. 画面用のリストを返す
		return modelList;
	}

	/**
	 * 社員新規登録
	 */
	@PostMapping("/create")
	public ResponseEntity<?> registerEmployee(
			@RequestBody @Validated EmployeeCreateForm createForm,
			BindingResult bindingResult) {


		// バリデーションチェックpass一致確認
		if (!Objects.equals(createForm.getPassword(), createForm.getLastPass())) {
			bindingResult.rejectValue("lastPass", "NotMatch", "パスワードと確認用パスワードが一致しません");
		}
		// 社員番号の重複チェック
		LoginUser checkNo = loginUserService.getUserByEmployeeNo(createForm.getEmployeeNo());
		if (checkNo != null) {
			bindingResult.rejectValue("employeeNo", "Duplicate", "この社員番号は既に登録されています");
		}

		// メールアドレスの重複チェック
		String emailKey = createForm.getEmail();
		LoginUser checkEmail = loginUserService.getUserByLoginId(emailKey);
		if (checkEmail != null) {
			bindingResult.rejectValue("email", "Duplicate", "このメールアドレスは既に登録されています");
		}

		// バリデーションチェック
		if (bindingResult.hasErrors()) {
			// エラーメッセージをリストにまとめてReactへ 400 Bad Request で返却
			List<String> errors = bindingResult.getAllErrors().stream()
					.map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(errors);
		}

		try {
			// パスワードを暗号化（ハッシュ化）する
			String hashedPassword = passwordEncoder.encode(createForm.getPassword());

			//  登録用のエンティティを新しく組み立てる
			LoginUser newUser = new LoginUser();
			newUser.setEmployeeNo(createForm.getEmployeeNo());
			newUser.setEmployeeName(createForm.getEmployeeName());
			newUser.setEmail(createForm.getEmail());

			// String型の入社日を LocalDate に変換してセット
			newUser.setStartDate(LocalDate.parse(createForm.getStartDate()));

			newUser.setPassword(hashedPassword);
			newUser.setRoleCd(createForm.getRoleCd());

			// サービスを呼び出してデータベースに保存
			loginUserService.createLoginUser(newUser);

			// Reactへ（200 OK）を返す
			return ResponseEntity.ok("Success");

		} catch (

		Exception e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(List.of("failed"));
		}

	}

	// 社員更新
	@PatchMapping("/update")
	public ResponseEntity<?> updateEmployee(
			@RequestBody @Validated EmployeeUpdateForm updateForm,
			BindingResult bindingResult) {

		//パスワード一致確認
		if (!java.util.Objects.equals(updateForm.getPassword(), updateForm.getConfirmPass())) {
			bindingResult.rejectValue("confirmPass", "NotMatch", "パスワードと確認用パスワードが一致しません");
		}

		// バリデーションチェック
		if (bindingResult.hasErrors()) {
			// エラーメッセージをリストにまとめて、フロント（React）へ 400 Bad Request で返却
			List<String> errors = bindingResult.getAllErrors().stream()
					.map(error -> error.getDefaultMessage())
					.collect(Collectors.toList());
			return ResponseEntity.badRequest().body(errors);
		}

		try {
			// 画面から送られてきた社員番号の現在のデータを取得
			LoginUser employee = loginUserService.getUserByLoginId(updateForm.getEmail());

			// 社員が見つからない時はここで即 return
			if (employee == null) {
				return ResponseEntity.badRequest().body(List.of("対象が見つかりません"));
			}

			// 画面から入力された社員番号で、すでにDBにいるか検索してみる
			LoginUser checkNo = loginUserService.getUserByEmployeeNo(updateForm.getEmployeeNo());

			// DBにデータが存在かつそのデータの主キーが、今の自分の主キーとは違う他人の番号と被っているのでエラー
			if (checkNo != null && !checkNo.getId().equals(employee.getId())) {
				return ResponseEntity.badRequest().body(List.of("この社員番号は既に他の社員に割り当てられています"));
			}

			employee.setEmployeeNo(updateForm.getEmployeeNo());

			// 正常に見つかった場合は、if文の外側（ここ）で各項目を更新
			employee.setEmployeeName(updateForm.getEmployeeName());

			// 文字列の日付をLocalDateにする
			if (updateForm.getStartDate() != null && !updateForm.getStartDate().isEmpty()) {
				employee.setStartDate(LocalDate.parse(updateForm.getStartDate()));
			}

			// 権限コード
			employee.setRoleCd(updateForm.getRoleCd());

			// パスワードが入力されている場合のみ処理を行う
			if (updateForm.getPassword() != null && !updateForm.getPassword().isEmpty()) {

				// パスワードを新しく暗号化（ハッシュ化）してエンティティにセット
				String hashedPassword = passwordEncoder.encode(updateForm.getPassword());
				employee.setPassword(hashedPassword);

			} else {
				// パスワードが入力されていない場合はnullにして上書きしないようにする
				employee.setPassword(null);
			}

			employee.setId(updateForm.getId());

			// サービスメソッドを呼び出してデータベースを更新
			loginUserService.updateLoginUser(employee);

			// Reactへ成功を返す
			return ResponseEntity.ok("Success");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(List.of("failed"));
		}
	}

	/**
	 * 削除
	 */
	@DeleteMapping("/delete/{employeeNo}")
	public ResponseEntity<String> deleteEmployee(
			@PathVariable("employeeNo") String employeeNo) {

		try {
			// サービスを呼び出してデータベースから削除を実行
			int result = loginUserService.deleteLoginUser(employeeNo);

			if (result > 0) {
				return ResponseEntity.ok("Success");
			} else {
				return ResponseEntity.badRequest().body("対象の社員が見つかりません");
			}

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("failed");
		}
	}

}
