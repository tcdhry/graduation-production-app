import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QuestionBean } from "../../beans/QuestionBean";
import { UserBean } from "../../beans/UserBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import { State } from "../../redux/store";
import QuestionView from "../global_components/QuestionView";
import SmoothScrollLink from "../global_components/SmoothScrollLink";
import QuestionInputs, { TitleStatus } from "./manager_components/QuestionInputs";

function PostQuestion() {
    const user = useSelector((state: State) => state.loginUser.user as UserBean);
    const [question, setQuestion] = useState<QuestionBean>(new QuestionBean(user));
    const [submit, setSubmit] = useState(false);
    const navigate = useNavigate();
    const [titleStatus, setTitleStatus] = useState(TitleStatus.NotEntered);
    const [submitError, setSubmitError] = useState<JSX.Element | null>(null);

    return (
        <>
            <div id="post-question">
                <h2>新規問題投稿</h2>
                <h3>内容を入力</h3>
                <form onSubmit={function (event: AnyFormEvent) {
                    /**
                     * ユーザの入力忘れ等のミスのみを検証し、
                     * 開発者ツールから弄らない限り取り得ない値などは攻撃とみなし、検証はバックエンドのみでする。
                     * 攻撃へのエラーメッセージ返答はどの程度するのか、要件等。
                     */
                    event.preventDefault();
                    if (submit === true) {
                        return;
                    }

                    const form = event.target;
                    const question_title = question.question_title;
                    const question_text = question.question_text;
                    const input = question.input;
                    const input_explain = question.input_explain;
                    const output = question.output;
                    const output_explain = question.output_explain;
                    const inputs = question.inputs;
                    const outputs = question.outputs;
                    const io_explain = question.io_explain;
                    const language_designation = question.language_designation;
                    // ここからはstateに無い情報なのでformから取得
                    const view_password = form.view_password.value;
                    const view_password_check = form.view_password_check.value;
                    const private_answer_mode = form.private_answer_mode.checked;
                    const release_flag = form.release_flag.checked;

                    let errorMessage = '';

                    if (titleStatus === TitleStatus.NotEntered) {
                        errorMessage += '・タイトルが記述されていません。\n';
                    }

                    if (titleStatus === TitleStatus.ExistTitle) {
                        errorMessage += '・タイトルが既に使用されています。\n';
                    }

                    if (titleStatus === TitleStatus.WhitespaceOnly) {
                        errorMessage += '・タイトルを空白文字だけで構成することはできません。\n';
                    }

                    if (question_text === '') {
                        errorMessage += '・問題文が記述されていません。\n';
                    }

                    if (view_password !== view_password_check) {
                        errorMessage += '・問題表示パスワードが（確認）と一致しません。\n';
                    }

                    if (errorMessage !== '') {
                        alert(errorMessage);
                        return;
                    }

                    if (window.confirm('登録します。\nチェックリストとプレビューは確認しましたか？')) {
                        setSubmit(true);
                        type PostQuestionResponse = ResponseBase & {
                            data: {
                                errorList: null | Array<{ errorTarget: string, errorMessage: string }>,
                                generatedId: null | number
                            }
                        }
                        axios.post(generateAPI(API.Manager._, API.Manager.postQuestion), {
                            question_title: question_title,
                            question_text: question_text,
                            input: input,
                            input_explain: input_explain,
                            output: output,
                            output_explain: output_explain,
                            inputs: inputs,
                            outputs: outputs,
                            io_explain: io_explain,
                            language_designation: language_designation,
                            view_password: view_password,
                            view_password_check: view_password_check,
                            private_answer_mode: private_answer_mode,
                            release_flag: release_flag
                        }).then((res: PostQuestionResponse) => {
                            setSubmit(false);
                            receiveResponse(res, navigate, function () {
                                const errors = res.data.errorList;
                                if (errors === null) {
                                    /**
                                     * insert success
                                     * navigate to success page
                                     */
                                    navigate(generateURL(URL.Manager._, URL.Manager.postQuestionSuccess) + '/' + res.data.generatedId);
                                } else {
                                    let alertMessage = '';
                                    const listitem: Array<JSX.Element> = [];
                                    console.log(errors === null, errors)
                                    errors.forEach((error: { errorMessage: string; errorTarget: string; }) => {
                                        alertMessage += '・' + error.errorMessage + '\n';
                                        listitem.push(<SmoothScrollLink toID={error.errorTarget}>{error.errorMessage}</SmoothScrollLink>);
                                    });
                                    setSubmitError(<>{listitem}</>);
                                    alert(alertMessage);
                                }
                            });
                        }).catch((err) => { setSubmit(false); catchError(err); });
                    }
                }}>
                    <QuestionInputs question={question} setQuestion={setQuestion} titleStatus={titleStatus} setTitleStatus={setTitleStatus} />
                    {submitError === null ? null : (
                        <>
                            <h3>実行結果</h3>
                            <ul>
                                {submitError}
                            </ul>
                        </>
                    )}
                </form>
                <hr />

                <h3>プレビュー</h3>
                <QuestionView question={question} editorRef={undefined} />
            </div>
        </>
    );
}

export default PostQuestion;