import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { API, generateAPI, generateURL, URL } from "./constants/URL";

import LoginForm from "./components/auth_guest/LoginForm";
import NotFoundError from "./components/errors/NotFoundError";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

import axios from "axios";
import { useDispatch } from "react-redux";
import { ResponseBase } from "./constants/ResponseStatus";
import { loginUserSlice } from "./redux/userSlice";
import { UserBean } from "./beans/UserBean";

import AdminUniform from "./components/auth_admin/_AdminUniform";
import AdminIndex from "./components/auth_admin/_AdminIndex";
import ManagerIndex from "./components/auth_manager/_ManagerIndex";
import ManagerUniform from "./components/auth_manager/_ManagerUniform";
import UserIndex from "./components/auth_user/_UserIndex";
import UserUniform from "./components/auth_user/_UserUniform";

import AccountManage from "./components/auth_admin/AccountManage";
import BulkRegUser from "./components/auth_admin/BulkRegUser";
import EditExam from "./components/auth_manager/EditExam";
import EditQuestion from "./components/auth_manager/EditQuestion";
import PostExam from "./components/auth_manager/PostExam";
import PostQuestion from "./components/auth_manager/PostQuestion";
import PostQuestionSuccess from "./components/auth_manager/PostQuestionSuccess";
import ViewMyExams from "./components/auth_manager/ViewMyExams";
import ViewMyQuestions from "./components/auth_manager/ViewMyQuestions";
import Profile from "./components/auth_user/Profile";
import Ranking from "./components/auth_user/Ranking";
import ReferAnswer from "./components/auth_user/ReferAnswer";
import SelectStyle from "./components/auth_user/SelectStyle";
import SingleQuestionRanking from "./components/auth_user/SingleQuestionRanking";
import ViewExam from "./components/auth_user/ViewExam";
import ViewQuestion from "./components/auth_user/ViewQuestion";
import ViewQuestions from "./components/auth_user/ViewQuestions";
import GuestUniform from "./components/auth_guest/_GuestUniform";
import { useEffect, useState } from "react";
import Loading from "./components/errors/Loading";
import ServerDownError from "./components/errors/ServerDownError";
import SessionError from "./components/errors/SessionError";
import InsufficientAuthorityError from "./components/errors/InsufficientAuthorityError";

function App() {
    const { login } = loginUserSlice.actions;
    const dispatch = useDispatch();
    const [initialLoading, setInitialLoading] = useState(true);
    const [serverDown, setServerDown] = useState(false);

    /**
     * reload時の処理
     */
    type SessionCheckResponse = ResponseBase & {
        data: {
            user: UserBean | null
        }
    };
    useEffect(() => {
        axios.get(generateAPI(API.Guest.sessionCheck)).then((res: SessionCheckResponse) => {
            if (res.data.user !== null) {
                dispatch(login(res.data.user));
            }
            setInitialLoading(false);
        }).catch((res) => {
            console.log(res);
            setInitialLoading(false);
            setServerDown(true);
        });
        // ↓再レンダリングのたびに実行されるのを防ぐ？らしい。無くても想定通りの挙動だが、リンターが警告を吐くので一応入れておく。
    }, [dispatch, login]);


    return (
        <>
            <BrowserRouter>
                <Header />
                <main>
                    {
                        initialLoading === true ? (
                            <Loading />
                        ) : (
                            serverDown === true ? (
                                <ServerDownError />
                            ) : (
                                <Routes>
                                    <Route path={URL.Head}>
                                        <Route element={<GuestUniform />}>
                                            <Route path={URL.Guest.login} element={<LoginForm />} />
                                        </Route>

                                        <Route path={URL.Admin._} element={<AdminUniform />}>
                                            <Route path={URL.Admin.index} element={<AdminIndex />} />
                                            <Route path={URL.Admin.bulkRegUser} element={<BulkRegUser />} />{/* TODO */}
                                            <Route path={URL.Admin.accountManage} element={<AccountManage />} />{/* TODO */}
                                        </Route>

                                        <Route path={URL.Manager._} element={<ManagerUniform />}>
                                            <Route path={URL.Manager.index} element={<ManagerIndex />} />
                                            <Route path={URL.Manager.postQuestion} element={<PostQuestion />} />{/* TODO */}
                                            <Route path={URL.Manager.postQuestionSuccess + '/:question_id'} element={<PostQuestionSuccess />} />{/* TODO */}
                                            <Route path={URL.Manager.viewMyQuestions} element={<ViewMyQuestions />} />{/* TODO */}
                                            <Route path={URL.Manager.editQuestion + '/:question_id'} element={<EditQuestion />} />{/* TODO */}
                                            <Route path={URL.Manager.postExam} element={<PostExam />} />{/* TODO */}
                                            <Route path={URL.Manager.viewMyExams} element={<ViewMyExams />} />{/* TODO */}
                                            <Route path={URL.Manager.editExam + '/:exam_id'} element={<EditExam />} />{/* TODO */}
                                        </Route>

                                        <Route path={URL.User._} element={<UserUniform />}>
                                            <Route path={URL.User.index} element={<UserIndex />} />
                                            <Route path={URL.User.profile} element={<Profile />} />{/* TODO */}
                                            <Route path={URL.User.ranking} element={<Ranking />} />{/* TODO */}
                                            <Route path={URL.User.ranking + '/:question_id'} element={<SingleQuestionRanking />} />{/* TODO */}
                                            <Route path={URL.User.selectStyle} element={<SelectStyle />} />{/* TODO */}
                                            <Route path={URL.User.viewQuestions} element={<ViewQuestions />} />{/* TODO */}
                                            <Route path={URL.User.viewQuestion + '/:question_id'} element={<ViewQuestion />} />{/* TODO */}
                                            <Route path={URL.User.referAnswer + '/:question_id'} element={<ReferAnswer />} />{/* TODO */}
                                            <Route path={URL.User.viewExam + '/:exam_id'} element={<ViewExam />} />{/* TODO */}
                                        </Route>

                                        <Route path={URL.Guest.sessionError} element={<SessionError />} />
                                        <Route path={URL.Guest.insufficientAuthorityError} element={<InsufficientAuthorityError />} />
                                    </Route>

                                    <Route path={''} element={<Navigate to={generateURL(URL.Guest.login)} />} />

                                    <Route path={'/*'} element={<NotFoundError />} />
                                </Routes>
                            )
                        )
                    }
                </main>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;