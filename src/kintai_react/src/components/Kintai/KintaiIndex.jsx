import React from "react";

export default function KintaiIndex() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>勤怠入力画面</h1>
      <p>ログイン成功</p>

      {/* 動作確認用のログアウトボタン */}
      <form method="post" action="/logout">
        <button type="submit" className="btn btn-danger">
          ログアウト
        </button>
      </form>
    </div>
  );
}
