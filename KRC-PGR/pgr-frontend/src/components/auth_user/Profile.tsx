import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserBean } from "../../beans/UserBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import { State } from "../../redux/store";
import { loginUserSlice } from "../../redux/userSlice";
import { Col, Row } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";
import useErrorMessageState from "../global_components/useErrorMessageState";

const label_width = 4;

function ChangeViewNameForm() {
    const [changeMessage, setChangeMessage] = useErrorMessageState();
    const navigate = useNavigate();
    const { login } = loginUserSlice.actions;
    const dispatch = useDispatch();
    const user = useSelector((state: State) => state.loginUser.user as UserBean);

    return (
        <>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const new_view_name = event.target.view_name.value;

                if (new_view_name.length !== 0) {
                    if (new_view_name.replace(/\s+/g, '').length === 0) {
                        setChangeMessage('空白文字のみで登録することはできません。');
                        return;
                    } else if (new_view_name.length > 20) {
                        setChangeMessage('長すぎます。');
                        return;
                    }
                }

                type ChangeViewNameResponse = ResponseBase & {
                    data: {
                        changeStatus: number
                    }
                };
                axios.put(generateAPI(API.User._, API.User.changeViewName), { new_view_name: new_view_name }).then((res: ChangeViewNameResponse) => {
                    receiveResponse(res, navigate, function () {
                        let msg = '';
                        switch (res.data.changeStatus) {
                            case 0:
                                // Success
                                msg = '表示名を変更しました。';
                                dispatch(login({ ...user, view_name: new_view_name === '' ? null : new_view_name }));
                                break;
                            case 1:
                                // longer err
                                msg = '長すぎます。';
                                break;
                            case 2:
                                // whitespace only err
                                msg = '空白文字のみで登録することはできません。';
                                break;
                        }
                        setChangeMessage(msg);
                    });
                }).catch(catchError);
            }}>
                <h4>表示名の変更</h4>
                <LabelInput
                    label={<><label htmlFor="view_name">表示名</label></>}
                    label_width={label_width}
                    input={
                        <>
                            <input type="text" id="view_name" name="view_name" maxLength={20} />
                            <p>
                                空白文字を含めることはできますが、空白文字のみで登録することはできません。<br />
                                何も入力せずに決定することで、ユーザ名が表示されます。<br />
                            </p>
                            {changeMessage}
                        </>
                    }
                />
                <Row>
                    <Col>
                        <input type="submit" value="表示名を変更する" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}

function ChangePasswordForm() {
    /**
     * ここに書いたロジックは全てbundle.jsから見られる。
     * よってパスワード要件をチェックするロジックを書いてしまうとセキュリティ上よろしくないため、
     * どんなパスワードが入力されようと、バックエンドに送信する。
     * ただし、入力チェックと一致チェックだけはフロントエンドでも確認する。
     */
    // const [changeMessage, setChangeMessage] = useState(<>　</>);
    const [changeMessage, setChangeMessage] = useErrorMessageState();
    const navigate = useNavigate();

    return (
        <>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const password = event.target.password.value;
                const password_check = event.target.password_check.value;
                if (password.length === 0) {
                    setChangeMessage('新規パスワードが入力されていません。');
                    return;
                } else if (password !== password_check) {
                    setChangeMessage('新規パスワードが確認と一致しません。');
                    return;
                }
                type ChangePasswordResponse = ResponseBase & {
                    data: {
                        changeMessage: string
                    }
                };
                axios.put(generateAPI(API.User._, API.User.changePassword), { password: password, password_check: password_check }).then((res: ChangePasswordResponse) => {
                    receiveResponse(res, navigate, function () {
                        setChangeMessage(res.data.changeMessage);
                    });
                }).catch(catchError);
            }}>
                <h4>ログインパスワードの変更</h4>
                <LabelInput
                    label={<><label htmlFor="password">新規パスワード</label></>}
                    label_width={label_width}
                    input={
                        <>
                            <input type="password" id="password" name="password" />
                        </>
                    }
                />
                <LabelInput
                    label={<><label htmlFor="password_check">パスワード（確認）</label></>}
                    label_width={label_width}
                    input={
                        <>
                            <input type="password" id="password_ckeck" name="password_check" />
                            {changeMessage}
                        </>
                    }
                />
                <Row>
                    <Col>
                        <input type="submit" value="表示名を変更する" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}



function Profile() {
    const user = useSelector((state: State) => state.loginUser.user as UserBean);

    return (
        <>
            <h2>プロフィール</h2>
            <LabelInput
                label={<>ユーザID</>}
                input={<>{user.user_id}</>}
                label_width={label_width}
            />

            <hr />

            <LabelInput
                label={<>ユーザ名</>}
                label_width={label_width}
                input={<>{user.user_name}</>}
            />

            <hr />

            <LabelInput
                label={<>表示名</>}
                label_width={label_width}
                input={<>{user.view_name}</>}
            />

            <hr />

            <LabelInput
                label={<>権限</>}
                label_width={label_width}
                input={<>{user.authority_name}</>}
            />

            <hr />

            <LabelInput
                label={<>学部</>}
                label_width={label_width}
                input={<>{user.homeroom_class?.faculty_name}</>}
            />

            <hr />

            <LabelInput
                label={<>学科</>}
                label_width={label_width}
                input={<>{user.homeroom_class?.department_name}</>}
            />

            <hr />

            <LabelInput
                label={<>クラス</>}
                label_width={label_width}
                input={<>{user.homeroom_class?.class_name}</>}
            />

            <hr />

            <LabelInput
                label={<>出席番号</>}
                label_width={label_width}
                input={<>{user.student_number}</>}
            />

            <hr />
            <br />
            <h3>登録情報の変更</h3>
            <ChangeViewNameForm />

            <br />
            <hr />
            <br />

            <ChangePasswordForm />
        </>
    );
}

export default Profile;