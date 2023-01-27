import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExecStatusCode, ExecStatuses } from "../../constants/ExecStatus";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";

type AnswerBean = {
    user_id: number,
    user_name: string,
    student_number: number | null,
    class_id: number,
    class_name: string,
    department_id: number,
    department_name: string,
    faculty_id: number,
    faculty_name: string,
    select_language: number,
    rows_count: number,
    chars_count: number,
    insert_timestamp: string,
    exec_count: number,
    accepted_count: number,
    exec_statuses: Array<ExecStatusCode>,
};

function ViewAnswers() {
    const question_id = useParams().question_id;
    const navigate = useNavigate();
    const [answers, setAnswers] = useState<Array<AnswerBean>>([]);
    const [errorFlag, setErrorFlag] = useState<boolean>();
    const [question_title, setQuestion_title] = useState<string>();

    useEffect(() => {
        type ViewAnswersResponse = ResponseBase & {
            data: {
                errorFlag: boolean,
                question_title: string,
                answers: Array<AnswerBean>
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.viewAnswers) + '/' + question_id).then((res: ViewAnswersResponse) => {
            receiveResponse(res, navigate, function () {
                setErrorFlag(res.data.errorFlag);
                setAnswers(res.data.answers);
                setQuestion_title(res.data.question_title);
            });
        }).catch(catchError);
    }, [navigate, question_id]);

    if (answers === undefined) {
        return (
            <></>
        );
    }

    return (
        <>
            <h2>提出された解答一覧</h2>
            {errorFlag === true ? (
                <p>存在しない問題か、あなたが投稿した問題ではありません。</p>
            ) : (
                <></>
            )}
            <p>

                問題番号：{question_id}<br />
                タイトル：{question_title}
            </p>
            {answers === null ? (
                <></>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>ユーザID</th>
                            <th>ユーザ名</th>
                            <th>クラス</th>
                            <th>出席番号</th>
                            <th>文字数</th>
                            <th>行数</th>
                            <th>提出日時</th>
                            <th>実行結果</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            answers.map((answer, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{answer.user_id}</td>
                                        <td>{answer.user_name}</td>
                                        <td>{answer.class_name}</td>
                                        <td>{answer.student_number}</td>
                                        <td>{answer.chars_count}</td>
                                        <td>{answer.rows_count}</td>
                                        <td>{answer.insert_timestamp}</td>
                                        <td>
                                            {
                                                answer.exec_count === 0 ? (
                                                    <>実行テスト無し</>
                                                ) : (
                                                    <table className="exec-statues-color-view">
                                                        <tbody>
                                                            <tr>
                                                                {
                                                                    answer.exec_statuses.map((exec, j) => {
                                                                        const status = ExecStatuses[exec];
                                                                        return (
                                                                            <td key={j} className={'exec-result-' + (status.statusCode === ExecStatusCode.Accepted ? 'accepted' : 'wrong')}></td>
                                                                        );
                                                                    })
                                                                }
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                )
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            )}
        </>
    );
}

export default ViewAnswers;