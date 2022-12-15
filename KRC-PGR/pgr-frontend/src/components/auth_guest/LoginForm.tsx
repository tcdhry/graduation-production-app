import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserBean } from "../../beans/UserBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { AuthorityID } from "../../constants/Authority";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import { loginUserSlice } from "../../redux/userSlice";
import { Col, Row } from "../global_components/24ColLayout";
import useErrorMessageState from "../global_components/useErrorMessageState";

function LoginForm() {
    const [errorMessage, setErrorMessage] = useErrorMessageState();
    const navigate = useNavigate();
    const { login } = loginUserSlice.actions;
    const dispatch = useDispatch();

    return (
        <>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const user_id = event.target.user_id.value;
                const password = event.target.password.value;

                type LoginResponse = ResponseBase & {
                    data: {
                        user: UserBean | null // ログイン成功でユーザ情報が格納される。
                    }
                };
                axios.post(generateAPI(API.Guest.login), { user_id: user_id, password: password }).then((res: LoginResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.user !== null) {
                            dispatch(login(res.data.user));

                            switch (res.data.user.authority_id) {
                                case AuthorityID.Admin:
                                    navigate(generateURL(URL.Admin._, URL.Admin.index));
                                    break;
                                case AuthorityID.Manager:
                                    navigate(generateURL(URL.Manager._, URL.Manager.index));
                                    break;
                                case AuthorityID.User:
                                    navigate(generateURL(URL.User._, URL.User.index));
                                    break;
                            }
                        } else {
                            setErrorMessage('ログイン失敗');
                        }
                    });
                }).catch(catchError);
            }}>
                <Row>
                    <Col width={4}>
                        <label htmlFor="user_id">ユーザID</label>
                    </Col>
                    <Col width={20}>
                        <input type="text" id="user_id" name="user_id" />
                    </Col>
                </Row>
                <Row>
                    <Col width={4}>
                        <label htmlFor="password">パスワード</label>
                    </Col>
                    <Col width={20}>
                        <input type="password" id="password" name="password" />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {errorMessage}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <input type="submit" value="Login" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}

export default LoginForm;