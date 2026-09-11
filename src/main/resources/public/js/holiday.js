/**
 * ラジオボタンの選択状態に応じて、更新・削除ボタンの活性/非活性を切り替える
 */
function toggleActionButtons() {
	const koushinBtn = document.getElementById('koushin-btn');
	const sakuzyoBtn = document.getElementById('sakuzyo-btn');

	if (koushinBtn && sakuzyoBtn) {
		// 選択されているラジオボタンがあるかどうかを判定
		const form = document.getElementById('actionForm');
		const isChecked = form ? !!form.querySelector('input[name="selectedHoliday"]:checked') : false;

		// 選択されていれば disabled を false、選択されていなければ true にする
		koushinBtn.disabled = !isChecked;
		sakuzyoBtn.disabled = !isChecked;
	}
}

/**
 * 選択されたラジオボタンと、その行（tr）の要素を取得する共通の補助関数
 * @returns { {radio: HTMLInputElement, row: HTMLTableRowElement} | null }
 */
function getSelectedRowData() {
	const form = document.getElementById('actionForm');
	if (!form) return null;

	const selectedRadio = form.querySelector('input[name="selectedHoliday"]:checked');

	if (!selectedRadio) {
		alert('対象の祝日を選択してください。');
		return null;
	}

	return {
		radio: selectedRadio,
		row: selectedRadio.closest('tr')
	};
}

// 画面読み込み時の処理（エラーチェックと各イベント設定）
document.addEventListener('DOMContentLoaded', () => {

	// 0. 初期状態のボタン制御 ＆ ラジオボタン変更時のイベントリスナー登録
	toggleActionButtons();
	const form = document.getElementById('actionForm');
	if (form) {
		form.addEventListener('change', (event) => {
			if (event.target.name === 'selectedHoliday') {
				toggleActionButtons();
			}
		});
	}

	// 1. エラー発生時に自動で該当のモーダルを開く処理
	const scriptTag = document.getElementById('holiday-script');
	if (scriptTag) {
		const hasErrors = scriptTag.getAttribute('data-has-errors') === 'true';

		if (hasErrors) {
			// バックエンド側から「どの処理でエラーが起きたか」の識別子（'sinki', 'koushin', 'sakuzyo' など）を
			// data-error-type 属性などで追加で受け取れるようにすると確実です。
			const errorType = scriptTag.getAttribute('data-error-type') || 'sinki';

			// エラーの種類に応じたモーダル要素を取得する
			const targetModalEl = document.getElementById(`${errorType}-modal`);

			if (targetModalEl) {
				const errorModal = new bootstrap.Modal(targetModalEl);
				errorModal.show();
			}
		}
	}


	// 2. 更新処理
	const koushinModal = document.getElementById('koushin-modal');
	if (koushinModal) {
		koushinModal.addEventListener('show.bs.modal', (event) => {
			const rowData = getSelectedRowData();
			if (!rowData) {
				event.preventDefault();
				return;
			}

			const { radio, row } = rowData;

			// 日付と祝日名のテキストを取得（列インデックスの安全性を考慮）
			const holidayDate = row.cells[1] ? row.cells[1].textContent.trim() : '';
			const holidayName = row.cells[2] ? row.cells[2].textContent.trim() : '';

			// モーダル内の各入力欄に値をセット
			const editIdEl = document.getElementById('editHolidayId');
			const editDateEl = document.getElementById('editHolidayDate');
			const editNameEl = document.getElementById('editHolidayName');

			if (editIdEl) editIdEl.value = radio.value;
			if (editDateEl) editDateEl.value = holidayDate;
			if (editNameEl) editNameEl.value = holidayName;
		});
	}

	// 3. 削除処理
	const sakuzyoModal = document.getElementById('sakuzyo-modal');
	if (sakuzyoModal) {
		sakuzyoModal.addEventListener('show.bs.modal', (event) => {
			const rowData = getSelectedRowData();
			if (!rowData) {
				event.preventDefault();
				return;
			}

			const { radio } = rowData;
			const holidayId = radio.value;

			const inputId = document.getElementById('delete-holiday-id');
			if (inputId) {
				inputId.value = holidayId;
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", function() {
	// HTMLに埋め込んだ errorType の値を取得
	const errorType = document.getElementById("errorType")?.value;

	if (errorType === "register") {
		// 新規登録モーダルを自動で開く
		const sinkiModal = new bootstrap.Modal(document.getElementById("sinki-modal"));
		sinkiModal.show();
	} else if (errorType === "update") {
		// 更新モーダルを自動で開く
		const koushinModal = new bootstrap.Modal(document.getElementById("koushin-modal"));
		koushinModal.show();
	}
});

document.addEventListener("DOMContentLoaded", function() {
	// HTMLに埋め込んだ errorType の値を取得
	const errorType = document.getElementById("errorType")?.value;

	if (errorType === "register") {
		// 新規登録モーダルを自動で開く
		const sinkiModal = new bootstrap.Modal(document.getElementById("sinki-modal"));
		sinkiModal.show();
	} else if (errorType === "update") {
		// 更新モーダルを自動で開く
		const koushinModal = new bootstrap.Modal(document.getElementById("koushin-modal"));
		koushinModal.show();
	}

	document.addEventListener("DOMContentLoaded", function() {
		// HTMLに埋め込んだ errorType の値を取得
		const errorType = document.getElementById("errorType")?.value;

		if (errorType === "register") {
			// 新規登録モーダルを自動で開く
			const sinkiModal = new bootstrap.Modal(document.getElementById("sinki-modal"));
			sinkiModal.show();
		} else if (errorType === "update") {
			// 更新モーダルを自動で開く
			const koushinModal = new bootstrap.Modal(document.getElementById("koushin-modal"));
			koushinModal.show();
		}
	});

	// ==========================================
	// ★ 修正：成功フラグがあり、かつ検索条件が入っていれば再検索
	// ==========================================
	if (successType === "register" || successType === "update" || successType === "delete") {
		const searchDate = document.getElementById('date');
		const searchName = document.getElementById('holidayName');

		const hasDate = searchDate && searchDate.value.trim() !== '';
		const hasName = searchName && searchName.value.trim() !== '';

		if (hasDate || hasName) {
			const searchForm = document.querySelector('form[action*="/holiday/list"][method="get"]');
			if (searchForm) {
				searchForm.submit();
			}
		}
	}
});