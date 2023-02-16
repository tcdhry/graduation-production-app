import axios from "axios";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { getLanguageName, LanguageCode } from "../../constants/Language";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import { Col, Row } from "../global_components/24ColLayout";
import LabelInput from "../global_components/LabelInput";
import useErrorMessageState from "../global_components/useErrorMessageState";

function ViewExam() {
    const exam_id = useParams().exam_id;
    const navigate = useNavigate();
    const [message, setMessage] = useErrorMessageState();
    const location = useLocation();
    type Exam = {
        user_id: number,
        user_view_name: string,
        exam_title: string,
        description: string,
        insert_timestamp: string,
        questions: Array<{ question_id: number, question_title: string, answered: boolean, language_designation: null | LanguageCode, allocate_score: number }>,
    };
    const [exam, setExam] = useState<Exam>();

    type ViewExamResponse = ResponseBase & {
        data: {
            notFound: boolean,
            exam: Exam
        }
    };
    useEffect(() => {
        axios.get(generateAPI(API.User._, API.User.viewExam) + '/' + exam_id).then((res: ViewExamResponse) => {
            receiveResponse(res, navigate, function () {
                if (res.data.notFound === false) {
                    setExam(res.data.exam);
                }
            });
        }).catch(catchError);
    }, [navigate, exam_id]);

    if (exam === undefined) {
        return (
            <>
                <h2>試験を受ける</h2>
                <form onSubmit={function (event: AnyFormEvent) {
                    event.preventDefault();

                    const password = event.target.password.value;

                    axios.post(generateAPI(API.User._, API.User.viewExam) + '/' + exam_id, { password: password }).then((res: ViewExamResponse) => {
                        receiveResponse(res, navigate, function () {
                            if (res.data.notFound === true) {
                                setMessage('パスワードか試験IDが間違っています。');
                            } else {
                                setExam(res.data.exam);
                            }
                        });
                    }).catch(catchError);
                }}>
                    <LabelInput
                        label={<label htmlFor="password">パスワード</label>}
                        input={
                            <>
                                <input type="password" required autoComplete="one-time-code" id="password" name="exam-view-password" />
                                {message}
                            </>
                        }
                        label_width={5}
                    />
                    <Row>
                        <Col>
                            <input type="submit" value="送信" className="btn btn-full" />
                        </Col>
                    </Row>
                </form>
            </>
        );
    }

    return (
        <div id="view-exam">
            <h2>{exam.exam_title}</h2>
            <Row>
                <Col>
                    <p id="exam-status">
                        <span>試験ID：{exam_id}</span>
                        <span>投稿者：{exam.user_view_name}</span>
                        <span>投稿者ID：{exam.user_id}</span>
                        <span>投稿日時：{exam.insert_timestamp}</span>
                    </p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ReactMarkdown children={exam.description} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p className="ta-right">行クリックで問題に移動</p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>問題名</th>
                                <th style={{ width: '3em' }}>配点</th>
                                <th style={{ width: '5em' }}>言語指定</th>
                                <th style={{ width: '5em' }}>解答</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exam.questions.map((question, i) => (
                                <tr key={i} onClick={function () {
                                    console.log(question.question_id);
                                    navigate(location.pathname + '/' + question.question_id);
                                }}>
                                    <td>{question.question_title}</td>
                                    <td>{question.allocate_score}</td>
                                    <td>{question.language_designation === null ? '指定なし' : getLanguageName(question.language_designation)}</td>
                                    <td>{question.answered === true ? '解答済み' : '未提出'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </div>
    );
}

export default ViewExam;