import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { API, generateAPI, generateURL, URL } from "./constants/URL";

import LoginForm from "./components/auth_guest/LoginForm";
import NotFoundError from "./components/errors/NotFoundError";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import AdminUniform from "./components/auth_admin/_AdminUniform";
import AdminIndex from "./components/auth_admin/_AdminIndex";
import ManagerIndex from "./components/auth_manager/_ManagerIndex";
import ManagerUniform from "./components/auth_manager/_ManagerUniform";
import UserIndex from "./components/auth_user/_UserIndex";
import UserUniform from "./components/auth_user/_UserUniform";
import axios from "axios";
import { useDispatch } from "react-redux";
import { ResponseBase } from "./constants/ResponseStatus";
import { loginUserSlice } from "./redux/userSlice";
import { UserBean } from "./beans/UserBean";

function App() {
    const { login } = loginUserSlice.actions;
    const dispatch = useDispatch();
    /**
     * reload時の処理
     * TODO sessionCheck
     */
    type SessionCheckResponse = ResponseBase & {
        data: {
            user: UserBean | null
        }
    };

    axios.get(generateAPI(API.Guest.sessionCheck)).then((res: SessionCheckResponse) => {
        if (res.data.user !== null) {
            dispatch(login(res.data.user));
        }
    });

    return (
        <>
            <BrowserRouter>
                <Header />
                <main>
                    <Routes>
                        <Route path={URL.Head}>
                            <Route path={URL.Guest.login} element={<LoginForm />} />
                            <Route path={URL.Admin._} element={<AdminUniform />}>
                                <Route path={URL.Admin.index} element={<AdminIndex />} />
                            </Route>
                            <Route path={URL.Manager._} element={<ManagerUniform />}>
                                <Route path={URL.Manager.index} element={<ManagerIndex />} />
                            </Route>
                            <Route path={URL.User._} element={<UserUniform />}>
                                <Route path={URL.User.index} element={<UserIndex />} />
                            </Route>
                        </Route>

                        <Route path={''} element={<Navigate to={generateURL(URL.Guest.login)} />} />
                        <Route path={'/*'} element={<NotFoundError />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;