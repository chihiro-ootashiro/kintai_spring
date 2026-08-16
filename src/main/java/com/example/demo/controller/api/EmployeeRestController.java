package com.example.demo.controller.api;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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

		// 1. サービス経由でDBからエンティティのリストを取得
		List<LoginUser> entityList = loginUserService.getLoginUserList(form);

		// 2. ModelMapper を使って EmployeeModel のリストに詰め替え、日本語をセットする
		List<EmployeeModel> modelList = entityList.stream()
				.map(entity -> {
					// まずは ModelMapper で標準の項目を自動コピー
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

		// 3. 画面用のモデルリストを返す
		return modelList;
	}

	/**
	 * 社員新規登録
	 */

	@PostMapping("/create")
	public ResponseEntity<String> registerEmployee(
			@RequestBody EmployeeCreateForm createForm) {

		try {
			// パスワードを暗号化（ハッシュ化）する
			String hashedPassword = passwordEncoder.encode(createForm.getPassword());

			//  登録用のエンティティ（LoginUser）を新しく組み立てる
			LoginUser newUser = new LoginUser();
			newUser.setEmployeeNo(createForm.getEmployeeNo());
			newUser.setEmployeeName(createForm.getEmployeeName());
			newUser.setEmail(createForm.getEmail());
			newUser.setStartDate(createForm.getStartDate());
			newUser.setPassword(hashedPassword);
			newUser.setRoleCd(createForm.getRoleCd());

			// サービスを呼び出してデータベースに保存
			loginUserService.createLoginUser(newUser);

			// Reactへ（200 OK）を返す
			return ResponseEntity.ok("Success");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("failed");
		}

	}

	//	社員更新
	@PatchMapping("/update")
	public ResponseEntity<String> updateEmployee(@RequestBody com.example.demo.domain.model.EmployeeModel updateModel) {

		try {
			//画面から送られてきた社員番号の現在のデータを取得
			LoginUser employee = loginUserService.getUserByLoginId(updateModel.getEmail());

			// 社員が見つからない時はここで即 return
			if (employee == null) {
				return ResponseEntity.badRequest().body("対象が見つかりません");
			}

			// 正常に見つかった場合は、if文の外側（ここ）で各項目を更新
			employee.setEmployeeName(updateModel.getEmployeeName());

			//文字列の日付をLocalDateにする
			if (updateModel.getStartDate() != null && !updateModel.getStartDate().isEmpty()) {
				employee.setStartDate(LocalDate.parse(updateModel.getStartDate()));
			}

			//権限コード
			employee.setRoleCd(updateModel.getRoleCd());

			// パスワードが入力されている場合のみ処理を行う
			if (updateModel.getPassword() != null && !updateModel.getPassword().isEmpty()) {

				// パスワードを新しく暗号化（ハッシュ化）してエンティティにセット
				String hashedPassword = passwordEncoder.encode(updateModel.getPassword());
				employee.setPassword(hashedPassword);

			} else {
				// パスワードが入力されていない（省略された）場合は、元々DBに入っている古いパスワードを上書きしないよう null を明示的にセットしてXMLの <if> タグで弾きます
				employee.setPassword(null);
			}

			// サービスメソッドを呼び出してデータベースを更新
			loginUserService.updateLoginUser(employee);

			// Reactへ成功を返す
			return ResponseEntity.ok("Success");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("failed");
		}
	}
	
		/**
		 * 削除
		 */
		@DeleteMapping("/delete/{employeeNo}")
		public ResponseEntity<String> deleteEmployee(
				@PathVariable("employeeNo") String employeeNo) {
			
			try {
				// 1. 💡 サービスを呼び出してデータベースから削除を実行します
				// (※まだサービスに作成していない場合は、この下で一緒に作ります！)
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
