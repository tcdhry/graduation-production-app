import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionBean } from "../../beans/QuestionBean";
import { UserBean } from "../../beans/UserBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import { State } from "../../redux/store";
import NotFoundError from "../errors/NotFoundError";
import QuestionView from "../global_components/QuestionView";
import SmoothScrollLink from "../global_components/SmoothScrollLink";
import QuestionInputs, { TitleStatus } from "./manager_components/QuestionInputs";

function EditQuestion() {
    const params = useParams();
    const question_id = params.question_id;
    const navigate = useNavigate();
    const user = useSelector((state: State) => state.loginUser.user);
    const [question, setQuestion] = useState<QuestionBean>(new QuestionBean(user as UserBean));
    const [viewFlag, setViewFlag] = useState<undefined | null | true>(undefined);
    const [titleStatus, setTitleStatus] = useState(TitleStatus.DefaultTitle);
    // const [submitError, setSubmitError] = useState<JSX.Element | null>(null);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        type EditQuestionResponse = ResponseBase & {
            data: {
                question: QuestionBean
            }
        }
        axios.get(generateAPI(API.Manager._, API.Manager.editQuestion) + '/' + question_id).then((res: EditQuestionResponse) => {
            receiveResponse(res, navigate, function () {
                if (res.data.question === null) {
                    setViewFlag(null);
                } else {
                    setViewFlag(true);
                    setQuestion(res.data.question);
                }
            })
        }).catch(catchError);
    }, [navigate, question_id]);

    if (viewFlag === undefined) {
        return (
            null
        );
    }

    if (viewFlag === null) {
        return (
            <>
                <NotFoundError />
            </>
        );
    }

    return (
        <>
            <Link to={generateURL(URL.Manager._, URL.Manager.editQuestionIO) + '/' + question_id} className="btn btn-full">採点用入出力の設定ページへ行く</Link>
            <form onSubmit={function (event: AnyFormEvent) {
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

                if (window.confirm('更新します。\nチェックリストとプレビューは確認しましたか？')) {
                    setSubmit(true);
                    type EditQuestionResponse = ResponseBase & {
                        data: {
                            errorList: null | Array<{ errorTarget: string, errorMessage: string }>,
                        }
                    }
                    axios.post(generateAPI(API.Manager._, API.Manager.editQuestion) + '/' + question_id, {
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
                    }).then((res: EditQuestionResponse) => {
                        setSubmit(false);
                        receiveResponse(res, navigate, function () {
                            const errors = res.data.errorList;
                            if (errors === null) {
                                /**
                                 * insert success
                                 * navigate to success page
                                 */
                                alert('更新完了');  
                                // navigate(generateURL(URL.Manager._, URL.Manager.postQuestionSuccess) + '/' + res.data.generatedId);
                            } else {
                                let alertMessage = '';
                                const listitem: Array<JSX.Element> = [];
                                console.log(errors === null, errors)
                                errors.forEach((error: { errorMessage: string; errorTarget: string; }) => {
                                    alertMessage += '・' + error.errorMessage + '\n';
                                    listitem.push(<SmoothScrollLink toID={error.errorTarget}>{error.errorMessage}</SmoothScrollLink>);
                                });
                                // setSubmitError(<>{listitem}</>);
                                alert(alertMessage);
                            }
                        });
                    }).catch((err) => { setSubmit(false); catchError(err); });
                }
            }}>
                <QuestionInputs
                    question={question}
                    setQuestion={setQuestion}
                    titleStatus={titleStatus}
                    setTitleStatus={setTitleStatus}
                />
            </form>

            <hr />

            <h3>プレビュー</h3>
            <QuestionView question={question} editorRef={undefined} />
        </>
    );
}

export default EditQuestion;