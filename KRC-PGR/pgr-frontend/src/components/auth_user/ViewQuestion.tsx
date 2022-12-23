import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionBean, QuestionThumbnail } from "../../beans/QuestionBean";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import Loading from "../errors/Loading";
import { Col, Row } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";
import QuestionsListView from "../global_components/QuestionsListView";
import QuestionView, { ExecConfirmButtonName } from "../global_components/QuestionView";
import useErrorMessageState from "../global_components/useErrorMessageState";
import AceEditor from "react-ace";


const label_width = 5;
function InputViewPasswordForm(props: { thumbnail: QuestionThumbnail, setQuestion: React.Dispatch<React.SetStateAction<QuestionBean | undefined | null>>, setThumbnail: React.Dispatch<React.SetStateAction<QuestionThumbnail | undefined | null>> }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useErrorMessageState();

    return (
        <>
            <Row>
                <Col>
                    <h2>パスワードを入力</h2>
                    <p>
                        この問題を表示するにはパスワードが必要です。
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <QuestionsListView questions={[props.thumbnail]} />
                </Col>
            </Row>
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const view_password = event.target.view_passowrd.value;

                if (view_password === '') {
                    setErrorMessage('パスワードを入力してください。');
                    return;
                }

                type QuestionWithPasswordResponse = ResponseBase & {
                    data: {
                        question: QuestionBean
                    }
                }
                axios.post(generateAPI(API.User._, API.User.questionWithPassword) + '/' + props.thumbnail.question_id, { view_password: view_password }).then((res: QuestionWithPasswordResponse) => {
                    receiveResponse(res, navigate, function () {
                        if (res.data.question === null) {
                            setErrorMessage('パスワードが間違っています。');
                        } else {
                            props.setQuestion(res.data.question);
                            props.setThumbnail(null);
                        }
                    });
                }).catch(catchError);
            }}>
                <LabelInput
                    label={<label htmlFor="view_passowrd">表示パスワード</label>}
                    input={
                        <>
                            <input type="password" id="view_passowrd" name="view_passowrd" autoComplete="one-time-code" />
                            {errorMessage}
                        </>
                    }
                    label_width={label_width}
                />

                <Row>
                    <Col>
                        <input type="submit" value="パスワード検証" className="btn btn-full" />
                    </Col>
                </Row>
            </form>
        </>
    );
}

const AnswerConfirmButtonName = 'answer-confirm-button';

function ViewQuestion() {
    const params = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState<QuestionBean | undefined | null>(undefined);
    const [thumbnail, setThumbnail] = useState<QuestionThumbnail | undefined | null>(undefined);
    const editorRef = useRef(null);

    useEffect(() => {
        type QuestionResponse = ResponseBase & {
            data: {
                question: QuestionBean | null,
                thumbnail: QuestionThumbnail | null
            }
        }
        axios.get(generateAPI(API.User._, API.User.question) + '/' + params.question_id).then((res: QuestionResponse) => {
            receiveResponse(res, navigate, function () {
                setQuestion(res.data.question);
                setThumbnail(res.data.thumbnail);
            });
        }).catch(catchError);
    }, [navigate, params.question_id]);


    /**
     * question, thumbnail
     * 初期値 undefined
     * 通信後 null | Bean
     * ------------------------------------------
     * | question  | thumbnail | 状態           |
     * |-----------|-----------|----------------|
     * | undefined | undefined | Loading        |
     * | null      | null      | NotFound       |
     * | not null  | null      | input password |
     * | null      | not undef | view question  |
     * ------------------------------------------
     */

    /**
     * ここ以降undefined判定を省くため || で判定する。
     * 片方のみundefinedはロジック上あり得ないためこれでよし。
     */
    if (question === undefined || thumbnail === undefined) {
        return (
            <Loading />
        );
    }

    if (question !== null) {
        return (
            <form onSubmit={function (event: AnyFormEvent & { nativeEvent: { submitter: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> } }) {
                event.preventDefault();

                // https://github.com/securingsincity/react-ace/issues/685
                const source_code = (editorRef.current! as AceEditor).editor.getValue();
                // 言語指定が無ければ選択言語を取得、言語指定があればその言語IDを取得。
                const select_language = question.language_designation === null ? Number(event.target.language_designation.value) : question.language_designation;

                switch (event.nativeEvent.submitter.name) {
                    case ExecConfirmButtonName:
                        // 提出前実行確認
                        type ExecConfirmResponse = ResponseBase & {
                            data: {

                            }
                        }
                        axios.post(generateAPI(API.User._, API.User.execConfirm) + '/' + params.question_id, { source_code: source_code, select_language: select_language }).then((res: ExecConfirmResponse) => {
                            receiveResponse(res, navigate, function () {
                                console.log(res)
                            });
                        }).catch(catchError);
                        break;
                    case AnswerConfirmButtonName:
                        // 解答確定提出

                        break;
                }

                // type SubmissionCodeResponse = ResponseBase & {
                //     data: {
                //         execList: Array<ExecStatus>
                //     }
                // };
                // axios.post(
                //     generateAPIPath(API.user, API.submissionCode),
                //     { question_id: question.question_id, source_code: source_code, language: select_language }
                // ).then((res: SubmissionCodeResponse) => {
                //     console.log('receive')
                //     receiveResponse(res, navigate, function () {
                //         console.log(res);
                //         setExecList(res.data.execList);
                //     });
                // });
                // }
            }} >
                <QuestionView question={question} editorRef={editorRef} />
                <Row>
                    <Col>
                        <input type="submit" value="提出" className="btn btn-full" name={AnswerConfirmButtonName} />
                    </Col>
                </Row>
            </ form>
        );
    }

    if (thumbnail !== null) {
        return (
            <InputViewPasswordForm thumbnail={thumbnail} setQuestion={setQuestion} setThumbnail={setThumbnail} />
        );
    }

    return (
        <>
            <Row>
                <Col>
                    <h2>問題を表示できません</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    問題ID：`{params.question_id}` の問題は、存在しないか公開されていません。
                </Col>
            </Row>
        </>
    );
}

export default ViewQuestion;