import "./App.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { API, generateAPI, generateURL, URL } from "./constants/URL";

import LoginForm from "./components/auth_guest/LoginForm";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

import axios from "axios";
import { useDispatch } from "react-redux";
import { ResponseBase, logResponse } from "./constants/ResponseStatus";
import { loginUserSlice } from "./redux/userSlice";
import { UserBean } from "./beans/UserBean";
import useCookieWrap from "./components/global_components/useCookieWrap";
import { lazy, Suspense, useEffect, useState } from "react";

import NotFoundError from "./components/errors/NotFoundError";
import Loading from "./components/errors/Loading";
import ServerDownError from "./components/errors/ServerDownError";
import SessionError from "./components/errors/SessionError";
import InsufficientAuthorityError from "./components/errors/InsufficientAuthorityError";
import Develop from "./Develop";

const AdminUniform = lazy(() => import('./components/auth_admin/_AdminUniform'));
const AdminIndex = lazy(() => import("./components/auth_admin/_AdminIndex"));
const AccountManage = lazy(() => import("./components/auth_admin/AccountManage"));
const ClassManage = lazy(() => import("./components/auth_admin/ClassManage"));
const StyleManage = lazy(() => import("./components/auth_admin/StyleManage"));
const BulkRegUser = lazy(() => import("./components/auth_admin/BulkRegUser"));

const ManagerIndex = lazy(() => import("./components/auth_manager/_ManagerIndex"));
const ManagerUniform = lazy(() => import("./components/auth_manager/_ManagerUniform"));
const EditExam = lazy(() => import("./components/auth_manager/EditExam"));
const EditQuestion = lazy(() => import("./components/auth_manager/EditQuestion"));
const PostExam = lazy(() => import("./components/auth_manager/PostExam"));
const PostQuestion = lazy(() => import("./components/auth_manager/PostQuestion"));
const PostQuestionSuccess = lazy(() => import("./components/auth_manager/PostQuestionSuccess"));
const ViewMyExams = lazy(() => import("./components/auth_manager/ViewMyExams"));
const ViewMyQuestions = lazy(() => import("./components/auth_manager/ViewMyQuestions"));
const EditQuestionIO = lazy(() => import("./components/auth_manager/EditQuestionIO"));
const ViewAnswers = lazy(() => import("./components/auth_manager/ViewAnswers"));

const UserIndex = lazy(() => import("./components/auth_user/_UserIndex"));
const UserUniform = lazy(() => import("./components/auth_user/_UserUniform"));
const Profile = lazy(() => import("./components/auth_user/Profile"));
// const Ranking = lazy(() => import("./components/auth_user/Ranking"));
const ReferAnswer = lazy(() => import("./components/auth_user/ReferAnswer"));
const SelectStyle = lazy(() => import("./components/auth_user/SelectStyle"));
const SingleQuestionRanking = lazy(() => import("./components/auth_user/SingleQuestionRanking"));
const ViewExam = lazy(() => import("./components/auth_user/ViewExam"));
const ViewQuestion = lazy(() => import("./components/auth_user/ViewQuestion"));
const ViewAnswer = lazy(() => import("./components/auth_user/ViewAnswer"));
const ViewQuestions = lazy(() => import("./components/auth_user/ViewQuestions"));

const GuestUniform = lazy(() => import("./components/auth_guest/_GuestUniform"));



function App() {
    const { login } = loginUserSlice.actions;
    const dispatch = useDispatch();
    const [initialLoading, setInitialLoading] = useState(true);
    const [serverDown, setServerDown] = useState(false);
    const selectedStyle = useCookieWrap()[0];

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
            logResponse(res);
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

    useEffect(() => {
        if (selectedStyle === undefined) {
            return;
        }
        type SelectStyleResponse = ResponseBase & {
            data: {
                style: {
                    [key: string]: string
                }
            }
        };
        axios.get(generateAPI(API.Guest.getStyle) + '/' + selectedStyle).then((res: SelectStyleResponse) => {
            if (res.data.style === null) {
                return;
            }

            let style = '';
            Object.keys(res.data.style).slice(1).forEach((key) => {
                style += `${key.replaceAll('_', '-')}:${res.data.style[key]};`;
            });

            const styleDoc = document.getElementById('style')!;
            styleDoc.innerHTML = `:root{${style}}`;
        });
    }, [selectedStyle]);

    return (
        <>
            <style id="style"></style>
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

                                        <Route path={URL.Admin._ + '/*'} element={
                                            <Suspense fallback={<Loading />}>
                                                <Routes>
                                                    <Route element={<AdminUniform />}>
                                                        <Route path={URL.Admin.index} element={<AdminIndex />} />
                                                        <Route path={URL.Admin.bulkRegUser} element={<BulkRegUser />} />{/* TODO */}
                                                        <Route path={URL.Admin.accountManage} element={<AccountManage />} />{/* TODO */}
                                                        <Route path={URL.Admin.styleManage} element={<StyleManage />} />{/* TODO */}
                                                        <Route path={URL.Admin.classManage} element={<ClassManage />} />{/* TODO */}
                                                        <Route path={'/*'} element={<NotFoundError />} />
                                                    </Route>
                                                </Routes>
                                            </Suspense>
                                        } />

                                        <Route path={URL.Manager._ + '/*'} element={
                                            <Suspense fallback={<Loading />}>
                                                <Routes>
                                                    <Route element={<ManagerUniform />}>
                                                        <Route path={URL.Manager.index} element={<ManagerIndex />} />
                                                        <Route path={URL.Manager.postQuestion} element={<PostQuestion />} />
                                                        <Route path={URL.Manager.postQuestionSuccess + '/:question_id'} element={<PostQuestionSuccess />} />
                                                        <Route path={URL.Manager.editQuestionIO + '/:question_id'} element={<EditQuestionIO />} />
                                                        <Route path={URL.Manager.viewMyQuestions} element={<ViewMyQuestions />} />
                                                        <Route path={URL.Manager.editQuestion + '/:question_id'} element={<EditQuestion />} />
                                                        <Route path={URL.Manager.viewAnswers + '/:question_id'} element={<ViewAnswers />} />
                                                        <Route path={URL.Manager.postExam} element={<PostExam />} />{/* TODO */}
                                                        <Route path={URL.Manager.viewMyExams} element={<ViewMyExams />} />{/* TODO */}
                                                        <Route path={URL.Manager.editExam + '/:exam_id'} element={<EditExam />} />{/* TODO */}
                                                        <Route path={'/*'} element={<NotFoundError />} />
                                                    </Route>
                                                </Routes>
                                            </Suspense>
                                        } />

                                        <Route path={URL.User._ + '/*'} element={
                                            <Suspense fallback={<Loading />}>
                                                <Routes>
                                                    <Route element={<UserUniform />}>
                                                        <Route path={URL.User.index} element={<UserIndex />} />
                                                        <Route path={URL.User.profile} element={<Profile />} />
                                                        {/* <Route path={URL.User.ranking} element={<Ranking />} />TODO */}
                                                        <Route path={URL.User.ranking + '/:question_id'} element={<SingleQuestionRanking />} />{/* TODO input password */}
                                                        <Route path={URL.User.selectStyle} element={<SelectStyle />} />
                                                        <Route path={URL.User.viewQuestions} element={<ViewQuestions />} />
                                                        <Route path={URL.User.viewQuestion + '/:question_id'} element={<ViewQuestion />} />
                                                        <Route path={URL.User.viewAnswer + '/:question_id'} element={<ViewAnswer />} />
                                                        <Route path={URL.User.referAnswer + '/:question_id'} element={<ReferAnswer />} />{/* TODO */}
                                                        <Route path={URL.User.viewExam + '/:exam_id'} element={<ViewExam />} />{/* TODO */}
                                                        <Route path={'/*'} element={<NotFoundError />} />
                                                    </Route>
                                                </Routes>
                                            </Suspense>
                                        } />

                                        <Route path={'*'} element={
                                            <Suspense fallback={<Loading />}>
                                                <Routes>
                                                    <Route element={<GuestUniform />}>
                                                        <Route path={URL.Guest.login} element={<LoginForm />} />
                                                    </Route>
                                                </Routes>
                                            </Suspense>
                                        } />

                                        <Route path={URL.Guest.sessionError} element={<SessionError />} />
                                        <Route path={URL.Guest.insufficientAuthorityError} element={<InsufficientAuthorityError />} />
                                    </Route>

                                    <Route path={''} element={<Navigate to={generateURL(URL.Guest.login)} />} />

                                    <Route path={'develop'} element={<Develop />} />
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