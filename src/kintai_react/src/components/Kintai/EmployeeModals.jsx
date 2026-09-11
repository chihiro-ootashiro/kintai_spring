import React, { useState, useEffect } from 'react';

// ==========================================
// Cookie値を取り出しておく
// ==========================================
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// 親から「selectedEmployee（選択された社員データ）」を受け取れるように引数に足します
const EmployeeModals = ({ selectedEmployee, onRefreshList }) => {

    // ==========================================
    // 1. 新規登録モーダル用の State
    // ==========================================
    const [num, setNum] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [mail, setMail] = useState('');
    const [pass, setPass] = useState('');
    const [lastPass, setLastPass] = useState('');
    const [roleCd, setroleCd] = useState('');
    const [registerErrors, setRegisterErrors] = useState([]);

    //モーダルを閉じたらエラーも消す
    useEffect(() => {
        const modalEl = document.getElementById('sinki-modal');


        const handleModalClose = () => {
            setRegisterErrors([]); // 新規登録のエラー表示をクリア
        };

        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', handleModalClose);
        }

        // クリーンアップ処理
        return () => {
            if (modalEl) {
                modalEl.removeEventListener('hidden.bs.modal', handleModalClose);
            }
        };
    }, []);

    // ==========================================
    // 2. 更新モーダル用の State
    // ==========================================
    const [updateNum, setUpdateNum] = useState('');
    const [updateName, setUpdateName] = useState('');
    const [updateMail, setUpdateMail] = useState('');
    const [updateDate, setUpdateDate] = useState('');
    const [updateRoleCd, setUpdateRoleCd] = useState('');
    const [updatePass, setUpdatePass] = useState('');
    const [updateConfirmPass, setUpdateConfirmPass] = useState('');
    const [updateErrors, setUpdateErrors] = useState([]);

    // ラジオボタンで選ばれた人が変わったら、自動的に更新欄にその人のデータをセットする仕組み
    useEffect(() => {
        if (selectedEmployee) {
            setUpdateNum(selectedEmployee.employeeNo || '');
            setUpdateName(selectedEmployee.employeeName || '');
            setUpdateMail(selectedEmployee.email || '');
            setUpdateDate(selectedEmployee.startDate || '');

            if (selectedEmployee.roleCd !== null && selectedEmployee.roleCd !== undefined) {
                setUpdateRoleCd(String(selectedEmployee.roleCd));
            } else {
                setUpdateRoleCd('');
            }
        }
    }, [selectedEmployee]);

    //モーダルを閉じたらエラーも消す
    useEffect(() => {
        const modalEl = document.getElementById('kousin-modal');

        // モーダルが閉じ終わったときの処理
        const handleModalClose = () => {
            setUpdateErrors([]);
        };

        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', handleModalClose);
        }

        // クリーンアップ
        return () => {
            if (modalEl) {
                modalEl.removeEventListener('hidden.bs.modal', handleModalClose);
            }
        };
    }, []);

    // ==========================================
    // 各ボタンが押された時の処理
    // ==========================================
    // 新規登録
    const handleRegister = async () => {
        // 処理開始時に以前のエラー表示をクリア
        setRegisterErrors([]);

        try {
            const form = {
                employeeNo: num,
                employeeName: name,
                email: mail,
                startDate: date,
                password: pass,
                roleCd: roleCd,
                lastPass: lastPass
            };

            const option = {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
                },
                body: JSON.stringify(form),
            };

            const response = await fetch("/api/employee/create", option);

            if (response.ok) {

                // モーダルを閉じる処理
                const modalEl = document.getElementById('sinki-modal');
                const modal = window.bootstrap?.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                // 入力欄をクリア
                setNum(''); setName(''); setDate(''); setMail(''); setPass(''); setLastPass(''); setroleCd('');

                //親コンポーネントの一覧をリフレッシュして自動検索をかける
                if (onRefreshList) onRefreshList("");
            } else {
                // Javaの BindingResult から返ってきたエラーメッセージ配列を取得
                const resData = await response.json();
                if (Array.isArray(resData)) {
                    setRegisterErrors(resData); // 配列ごとStateに格納
                } else {
                    setRegisterErrors(["登録に失敗しました"]);
                }
            }
        } catch (err) {
            console.error("登録通信エラー", err);
            setRegisterErrors(["通信エラーが発生しました"]);
        }
    };


    // 更新処理
    const handleUpdate = async () => {
        // 処理開始時に以前のエラー表示をクリア
        setUpdateErrors([]);

        // 送信直前にselectedEmployeeの全中身と、組み立てたformデータをコンソールに出す
        console.log("① 選択されている社員の全データ:", selectedEmployee);


        try {
            const form = {
                id: selectedEmployee?.id,
                employeeNo: updateNum,
                employeeName: updateName,
                email: updateMail,
                startDate: updateDate,
                password: updatePass,
                roleCd: updateRoleCd,
                confirmPass: updateConfirmPass
            };

            const option = {
                method: "PATCH",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
                },
                body: JSON.stringify(form)
            };

            const response = await fetch("/api/employee/update", option);
            if (response.ok) {
                const modalEl = document.getElementById('kousin-modal');
                const modal = window.bootstrap?.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                setUpdatePass('');
                setUpdateConfirmPass('');
                if (onRefreshList) onRefreshList("");
            } else {
                // Javaの BindingResult から返ってきたエラーメッセージ配列を取得
                const resData = await response.json();
                if (Array.isArray(resData)) {
                    setUpdateErrors(resData); // 配列ごとStateに格納
                } else {
                    setUpdateErrors(["更新に失敗しました"]);
                }
            }
        } catch (err) {
            console.error("更新通信エラー", err);
            setUpdateErrors(["通信エラーが発生しました"]);
        }
    };

    // 削除処理
    const handleDelete = async () => {
        try {
            const option = {
                method: "DELETE",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
                }
            };
            const response = await fetch(`/api/employee/delete/${selectedEmployee?.employeeNo}`, option);
            if (response.ok) {
                if (onRefreshList) onRefreshList(""); // 全件再取得
            } else {
                alert("削除に失敗しました");
            }
        } catch (err) {
            console.error("削除通信エラー", err);
        }
    };

    return (
        <>
            {/* 新規登録モーダル id="sinki-modal" */}
            <div className="modal fade" id="sinki-modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title">社員登録</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card shadow-sm">
                                <div className="card-header bg-light"><span>社員情報</span></div>

                                <div className="card-body">
                                    <div className="row">

                                        {/* 1. 社員番号 */}
                                        <div className="col-3">
                                            <label className="form-label">社員番号:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${registerErrors.some(msg => msg.includes('社員番号')) ? 'is-invalid' : ''}`}
                                                value={num}
                                                onChange={(e) => setNum(e.target.value)}
                                            />
                                            {registerErrors.some(msg => msg.includes('社員番号')) && (
                                                <div className="invalid-feedback">{registerErrors.find(msg => msg.includes('社員番号'))}</div>
                                            )}
                                        </div>

                                        {/* 2. 社員名 */}
                                        <div className="col-4">
                                            <label className="form-label">社員名:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${registerErrors.some(msg => msg.includes('社員名')) ? 'is-invalid' : ''}`}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            {registerErrors.some(msg => msg.includes('社員名')) && (
                                                <div className="invalid-feedback">{registerErrors.find(msg => msg.includes('社員名'))}</div>
                                            )}
                                        </div>

                                        {/* 3. 入社日 */}
                                        <div className="col-3">
                                            <label className="form-label">入社日:</label>
                                            <input
                                                type="date"
                                                className={`form-control ${registerErrors.some(msg => msg.includes('入社日')) ? 'is-invalid' : ''}`}
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                            {registerErrors.some(msg => msg.includes('入社日')) && (
                                                <div className="invalid-feedback">{registerErrors.find(msg => msg.includes('入社日'))}</div>
                                            )}
                                        </div>

                                        {/* 4. 権限 */}
                                        <div className="col-2">
                                            <label className="form-label">権限:</label>
                                            <select
                                                className={`form-select ${registerErrors.some(msg => msg.includes('権限')) ? 'is-invalid' : ''}`}
                                                value={roleCd}
                                                onChange={(e) => setroleCd(e.target.value)}
                                            >
                                                <option value=""></option>
                                                <option value="1">管理者</option>
                                                <option value="0">一般</option>
                                            </select>
                                            {registerErrors.some(msg => msg.includes('権限')) && (
                                                <div className="invalid-feedback">{registerErrors.find(msg => msg.includes('権限'))}</div>
                                            )}
                                        </div>

                                        {/* 5. メールアドレス */}
                                        <div className="col-4">
                                            <label className="form-label">メールアドレス:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${registerErrors.some(msg => msg.includes('メールアドレス')) ? 'is-invalid' : ''}`}
                                                value={mail}
                                                onChange={(e) => setMail(e.target.value)}
                                            />
                                            {registerErrors.some(msg => msg.includes('メールアドレス')) && (
                                                <div className="invalid-feedback">{registerErrors.find(msg => msg.includes('メールアドレス'))}</div>
                                            )}
                                        </div>

                                        {/* 6. パスワード */}
                                        <div className="col-4">
                                            <label className="form-label">パスワード:</label>
                                            <input
                                                type="password"
                                                className={`form-control ${registerErrors.some(msg => msg.includes('パスワード') && !msg.includes('確認')) ? 'is-invalid' : ''}`}
                                                value={pass}
                                                onChange={(e) => setPass(e.target.value)}
                                            />
                                            {registerErrors.some(msg => msg.includes('パスワード') && !msg.includes('確認')) && (
                                                <div className="invalid-feedback">{registerErrors.find(msg => msg.includes('パスワード') && !msg.includes('確認'))}</div>
                                            )}
                                        </div>

                                        {/* 7. 確認用パスワード */}
                                        <div className="col-4">
                                            <label className="form-label">確認用パスワード:</label>
                                            <input
                                                type="password"
                                                className={`form-control ${registerErrors.some(msg => msg.includes('確認用パスワード') || msg.includes('パスワードが一致しません')) ? 'is-invalid' : ''}`}
                                                value={lastPass}
                                                onChange={(e) => setLastPass(e.target.value)}
                                            />
                                            {registerErrors.some(msg => msg.includes('確認用パスワード') || msg.includes('パスワードが一致しません')) && (
                                                <div className="invalid-feedback">
                                                    {registerErrors.find(msg => msg.includes('確認用パスワード') || msg.includes('パスワードが一致しません'))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" className="btn btn-success" onClick={handleRegister}>登録</button>
                        </div>
                    </div>
                </div>
            </div>


            {/*  更新モーダル id="kousin-modal" */}
            <div className="modal fade" id="kousin-modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title">社員更新</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="card shadow-sm">
                                <div className="card-header bg-light">
                                    <span>社員情報</span>
                                </div>
                                <div className="card-body">
                                    <div className="row">

                                        {/* 社員番号 */}
                                        <div className="col-3">
                                            <label className="form-label">社員番号:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${updateErrors.some(msg => msg.includes('社員番号')) ? 'is-invalid' : ''}`}
                                                value={updateNum}
                                                onChange={(e) => setUpdateNum(e.target.value)}
                                            />
                                            {updateErrors.some(msg => msg.includes('社員番号')) && (
                                                <div className="invalid-feedback">{updateErrors.find(msg => msg.includes('社員番号'))}</div>
                                            )}
                                        </div>

                                        {/* 社員名 */}
                                        <div className="col-4">
                                            <label className="form-label">社員名:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${updateErrors.some(msg => msg.includes('社員名')) ? 'is-invalid' : ''}`}
                                                value={updateName}
                                                onChange={(e) => setUpdateName(e.target.value)}
                                            />
                                            {updateErrors.some(msg => msg.includes('社員名')) && (
                                                <div className="invalid-feedback">{updateErrors.find(msg => msg.includes('社員名'))}</div>
                                            )}
                                        </div>

                                        {/* 入社日 */}
                                        <div className="col-3">
                                            <label className="form-label">入社日:</label>
                                            <input
                                                type="date"
                                                className={`form-control ${updateErrors.some(msg => msg.includes('入社日')) ? 'is-invalid' : ''}`}
                                                value={updateDate}
                                                onChange={(e) => setUpdateDate(e.target.value)}
                                            />
                                            {updateErrors.some(msg => msg.includes('入社日')) && (
                                                <div className="invalid-feedback">{updateErrors.find(msg => msg.includes('入社日'))}</div>
                                            )}
                                        </div>

                                        {/* 権限 */}
                                        <div className="col-2">
                                            <label className="form-label">権限:</label>
                                            <select
                                                className={`form-select ${updateErrors.some(msg => msg.includes('権限')) ? 'is-invalid' : ''}`}
                                                value={updateRoleCd}
                                                onChange={(e) => setUpdateRoleCd(e.target.value)}
                                            >
                                                <option value=""></option>
                                                <option value="1">管理者</option>
                                                <option value="0">一般</option>
                                            </select>
                                            {updateErrors.some(msg => msg.includes('権限')) && (
                                                <div className="invalid-feedback">{updateErrors.find(msg => msg.includes('権限'))}</div>
                                            )}
                                        </div>

                                        {/* メールアドレス */}
                                        <div className="col-4">
                                            <label className="form-label">メールアドレス:</label>
                                            <input type="text" className="form-control" value={updateMail} disabled />
                                        </div>

                                        {/* パスワード */}
                                        <div className="col-4">
                                            <label className="form-label">パスワード:</label>
                                            <input
                                                type="password"
                                                className={`form-control ${updateErrors.some(msg => msg.includes('パスワード') && !msg.includes('確認')) ? 'is-invalid' : ''}`}
                                                value={updatePass}
                                                onChange={(e) => setUpdatePass(e.target.value)}
                                            />
                                            {updateErrors.some(msg => msg.includes('パスワード') && !msg.includes('確認')) && (
                                                <div className="invalid-feedback">{updateErrors.find(msg => msg.includes('パスワード') && !msg.includes('確認'))}</div>
                                            )}
                                        </div>

                                        {/* 確認用パスワード */}
                                        <div className="col-4">
                                            <label className="form-label">確認用パスワード:</label>
                                            <input
                                                type="password"
                                                className={`form-control ${updateErrors.some(msg => msg.includes('確認') || msg.includes('一致しません')) ? 'is-invalid' : ''}`}
                                                value={updateConfirmPass}
                                                onChange={(e) => setUpdateConfirmPass(e.target.value)}
                                            />
                                            {updateErrors.some(msg => msg.includes('確認') || msg.includes('一致しません')) && (
                                                <div className="invalid-feedback">
                                                    {updateErrors.find(msg => msg.includes('確認') || msg.includes('一致しません'))}
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>更新</button>
                        </div>
                    </div>
                </div>
            </div>

            {/*  削除モーダル  */}
            <div className="modal fade" id="sakuzyo-modal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h5 className="modal-title">社員削除</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body py-4">
                            <p>選択した社員を削除しますか？</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">削除</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeModals;
