import axios from "axios";
import JSZip from "jszip";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnyFormEvent } from "../../constants/AnyFormEvent";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import Loading from "../errors/Loading";
import NotFoundError from "../errors/NotFoundError";
import { LabelRadio } from "../global_components/LabelInput";
import ClassesCheckboxControl from "./manager_components/ClassesCheckboxControl";
import * as XLSX from "xlsx";

type Scores = Array<{
    user_id: number,
    user_name: string,
    student_number: number | null,
    class_id: number | null,
    class_name: string | null,
    department_id: number | null,
    department_name: string | null,
    faculty_id: number | null,
    faculty_name: string | null,
    question_ids: Array<null | number>,
    insert_timestampes: Array<null | string>,
    exec_counts: Array<null | number>,
    accepted_counts: Array<null | number>,
}>;

function ScoringExam() {
    const exam_id = useParams().exam_id;
    const navigate = useNavigate();

    const [exam_title, setExam_title] = useState<string>();
    const [uuid, setUuid] = useState<string>();
    const [allocate_scores, setAllocateScores] = useState<Array<number>>();
    const [scores, setScores] = useState<Scores>();
    const [loadDatetime, setLoadDatetime] = useState('');

    useEffect(() => {
        type ScoringExamResponse = ResponseBase & {
            data: {
                exam_title: null | string,
                uuid: null | string,
                allocate_scores: null | Array<number>,
                scores: null | Scores
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.scoringExam) + '/' + exam_id).then((res: ScoringExamResponse) => {
            receiveResponse(res, navigate, function () {
                if (res.data.exam_title && res.data.uuid && res.data.allocate_scores && res.data.scores) {
                    setLoadDatetime(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }).replace(/\//g, '-'));
                    setExam_title(res.data.exam_title);
                    setUuid(res.data.uuid);
                    setAllocateScores(res.data.allocate_scores);
                    setScores(res.data.scores);
                }
            });
        }).catch(catchError);
    }, [exam_id, navigate]);

    if (exam_title === undefined || uuid === undefined || allocate_scores === undefined || scores === undefined) {
        return (<Loading />);
    }

    if (exam_title === null || uuid === null || allocate_scores === null || scores === null) {
        return (<NotFoundError />);
    }

    return (
        <>
            <h2>試験の採点結果</h2>
            <p>試験ID：{exam_id}-{uuid}</p>
            <br />
            <form onSubmit={function (event: AnyFormEvent) {
                event.preventDefault();
                const checkboxList: Array<HTMLInputElement> = Array.from(event.target.querySelectorAll('table > tbody > tr > th > input[type="checkbox"][name="user_id"]'));
                const user_ids = checkboxList.filter(checkbox => checkbox.checked === true).map(checkbox => Number(checkbox.value));
                const zip_format = Number(event.target.zip_format.value);

                type DownloadExamAnswersResponse = ResponseBase & {
                    data: {
                        answers: Array<{
                            user_id: number,
                            user_name: string,
                            student_number: number | null,
                            class_id: number | null,
                            class_name: string | null,
                            department_id: number | null,
                            department_name: string | null,
                            faculty_id: number | null,
                            faculty_name: string | null,
                            file_name: string,
                            source_code: string,
                            outputs: Array<{
                                output: string
                            }>,
                            sort_index: number
                        }>
                    }
                }
                axios.post(generateAPI(API.Manager._, API.Manager.downloadExamAnswers) + '/' + exam_id, { user_ids: user_ids }).then((res: DownloadExamAnswersResponse) => {
                    receiveResponse(res, navigate, function () {
                        const answers = res.data.answers;
                        const zip = new JSZip();

                        answers.forEach((answer) => {
                            const path = formats(zip_format, answer.sort_index + 1, answer.user_id, answer.user_name, answer.student_number, answer.class_id, answer.class_name, answer.department_id, answer.department_name, answer.faculty_id, answer.faculty_name, answer.file_name);
                            zip.file(path, answer.source_code);
                            answer.outputs.forEach((output, i) => {
                                const outputPath = formats(zip_format, answer.sort_index + 1, answer.user_id, answer.user_name, answer.student_number, answer.class_id, answer.class_name, answer.department_id, answer.department_name, answer.faculty_id, answer.faculty_name, `output${i}.txt`);
                                zip.file(outputPath, output.output);
                            })
                        });

                        zip.generateAsync({ type: "blob" }).then(function (content) {
                            const link = document.createElement('a');
                            link.href = window.URL.createObjectURL(content);
                            link.download = '試験：' + exam_id + '.zip';
                            link.click();
                        });
                    });
                }).catch(catchError);
            }}>
                <AnswersTable allocate_scores={allocate_scores} scores={scores} />
                <br />
                <DownloadController scores={scores} />
                <hr />
                <input type="submit" value="ダウンロードする" className="btn btn-full" />
            </form>
            <br />
            <hr />
            <br />
            <button type="button" className="btn btn-full" onClick={function () {
                const json: any = [];
                scores.forEach(score => {
                    const row: { [key: string]: any } = {};
                    row['ユーザID'] = score.user_id;
                    row['ユーザ名'] = score.user_name;
                    row['分類'] = score.faculty_name;
                    row['学科'] = score.department_name;
                    row['クラス'] = score.class_name;
                    row['出席番号'] = score.student_number;

                    allocate_scores.forEach((allocate_score, i) => {
                        // row[''] = score.question_ids;
                        if (score.insert_timestampes[i] === null) {
                            row['問題' + (i + 1) + '提出日時'] = '未提出';
                            row['問題' + (i + 1) + '点数'] = '未提出';
                        } else {
                            row['問題' + (i + 1) + '提出日時'] = score.insert_timestampes[i];
                            row['問題' + (i + 1) + '点数'] = (score.exec_counts[i] === 0 ? 1.0 : score.accepted_counts[i]! / score.exec_counts[i]!) * allocate_score;
                        }
                    })
                    json.push(row);
                })


                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.json_to_sheet(json);
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                XLSX.writeFile(wb, `試験：${exam_id}.${loadDatetime}.xlsx`);
            }}>点数表をExcelでダウンロードする</button>
            ※ダウンロードされるExcelデータはページ読込時のものです。クリックした瞬間の最新データではありません。
        </>
    );
}

export default ScoringExam;

function AnswersTable(props: { allocate_scores: Array<number>, scores: Scores }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th style={{ width: '2em' }}>DL</th>
                    <th>所属</th>
                    <th>ユーザ名</th>
                    {props.allocate_scores.map((score, i) => <th key={i} style={{ width: '4em' }}>{i + 1}問目<br />{score}点</th>)}
                    <th style={{ width: '3em' }}>合計</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.scores.map((score, i) => {
                        let total = 0;
                        return (
                            <tr key={i}>
                                <th onClick={function (event) {
                                    const checkbox = event.currentTarget.querySelector('input') as HTMLInputElement;
                                    checkbox.checked = !checkbox.checked;
                                }}>
                                    <input type="checkbox"
                                        value={score.user_id} name="user_id" defaultChecked
                                        data-f={String(score.faculty_id)} data-d={String(score.department_id)} data-c={String(score.class_id)}
                                        onClick={function (event) { event.stopPropagation();/* 親onclick evnetをキャンセル */ }}
                                    />
                                </th>
                                <td className="hidden-wrapper">
                                    {score.class_name}&nbsp;
                                    {score.student_number}
                                    <span className="hidden-text">
                                        {score.faculty_name}&nbsp;
                                        {score.department_name}&nbsp;
                                        {score.class_name}&nbsp;
                                        {score.student_number}
                                    </span>
                                </td>
                                <td>{score.user_name}</td>
                                {
                                    score.question_ids.map((question_id, j) => {
                                        const sc = question_id === null ? 0 : ((score.exec_counts[j] === 0 ? 1.0 : score.accepted_counts[j]! / score.exec_counts[j]!) * props.allocate_scores[j]);
                                        total += sc;
                                        return (
                                            <td key={j}>
                                                {question_id === null ? ('未解答') : (sc)}
                                            </td>
                                        );
                                    })
                                }
                                <td>{total}</td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}

function DownloadController(props: { scores: Scores }) {
    return (
        <>
            <h3>ダウンロード対象の絞り込み</h3>
            <ClassesCheckboxControl classes={props.scores} />
            <h4>zipファイルのフォルダ構成</h4>
            <p>
                {
                    [0, 1].map((i) =>
                        <LabelRadio
                            key={i}
                            value={String(i)}
                            id={'zip_format' + i}
                            name="zip_format"
                            labelText={formats(i, '{question_number}', '{user_id}', '{user_name}', '{student_number}', '{class_id}', '{class_name}', '{department_id}', '{department_name}', '{faculty_id}', '{faculty_name}', '{file_name}')}
                            defaultChecked={i === 0}
                        />
                    )
                }
            </p>
        </>
    );
}

function formats(idx: number, question_number: number | string, user_id: number | string, user_name: string, student_number: number | null | string, class_id: number | null | string, class_name: string | null, department_id: number | null | string, department_name: string | null, faculty_id: number | null | string, faculty_name: string | null, file_name: string) {
    return [
        // `${user_name}(id:${user_id})/q${question_number}/${file_name}`,
        // `${user_name}(id:${user_id})_q${question_number}_${file_name}`,
        `${class_name}_${student_number}_${user_name}(id:${user_id})_q${question_number}_${file_name}`,
        `${class_name}/${student_number}_${user_name}(id:${user_id})/q${question_number}/${file_name}`,
    ][idx];
}