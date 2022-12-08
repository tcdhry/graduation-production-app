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
                                {/* <Route path={URL.Admin.bulkRegUser} element={<BulkRegUser />} /> */}
                                {/* <Route path={URL.Admin.accountManage} element={<AccountManage />} /> */}
                            </Route>
                            <Route path={URL.Manager._} element={<ManagerUniform />}>
                                <Route path={URL.Manager.index} element={<ManagerIndex />} />
                                {/* <Route path={URL.Manager.postQuestion} element={<PostQuestion />} /> */}
                                {/* <Route path={URL.Manager.viewMyQuestions} element={<ViewMyQuestions />} /> */}
                                {/* <Route path={URL.Manager.editQuestion + '/:question_id'} element={<EditQuestion />} /> */}
                                {/* <Route path={URL.Manager.postExam} element={<PostExam />} /> */}
                                {/* <Route path={URL.Manager.viewMyExams} element={<ViewMyExams />} /> */}
                                {/* <Route path={URL.Manager.editExam + '/:exam_id'} element={<EditExam />} /> */}
                            </Route>
                            <Route path={URL.User._} element={<UserUniform />}>
                                <Route path={URL.User.index} element={<UserIndex />} />
                                {/* <Route path={URL.User.profile} element={<Profile />} /> */}
                                {/* <Route path={URL.User.ranking} element={<Ranking />} /> */}
                                {/* <Route path={URL.User.ranking + '/:question_id'} element={<SingleQuestionRanking />} /> */}
                                {/* <Route path={URL.User.selectStyle} element={<SelectStyle />} /> */}
                                {/* <Route path={URL.User.viewQuestions} element={<ViewQuestions />} /> */}
                                {/* <Route path={URL.User.viewQuestion + '/:question_id'} element={<ViewQuestion />} /> */}
                                {/* <Route path={URL.User.referAnswer + '/:question_id'} element={<ReferAnswer />} /> */}
                                {/* <Route path={URL.User.viewExam + '/:question_id'} element={<ViewExam />} /> */}
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