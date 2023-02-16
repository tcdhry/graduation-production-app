import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI, generateURL, URL } from "../../constants/URL";
import Loading from "../errors/Loading";
import { Row, Col } from "../global_components/24ColLayout";

function ViewMyExams() {
    const navigate = useNavigate();
    type Exam = {
        exam_id: number,
        uuid: string,
        exam_title: string,
        insert_timestamp: string,
        release_flag: boolean,
        question_count: number
    };
    const [exams, setExams] = useState<Array<Exam>>();

    useEffect(() => {
        type MyExamsResponse = ResponseBase & {
            data: {
                exams: Array<Exam>
            }
        };
        axios.get(generateAPI(API.Manager._, API.Manager.getMyExams)).then((res: MyExamsResponse) => {
            receiveResponse(res, navigate, function () {
                setExams(res.data.exams);
            });
        }).catch(catchError);
    }, [navigate]);

    if (exams === undefined) {
        return (<Loading />);
    }

    return (
        <div id="view-my-exams">
            <h2>自分の試験一覧</h2>
            <div id="exams-list">
                <Row>
                    <Col>
                        {exams.map((exam, i) => (
                            <section key={i}>
                                <h3>
                                    <Link to={generateURL(URL.Manager._, URL.Manager.editExam) + '/' + exam.exam_id} className="text-link visited">
                                        <span>{exam.exam_title}</span>
                                        <span>{exam.insert_timestamp}</span>
                                    </Link>
                                </h3>
                                <div>試験ID：{exam.exam_id}-{exam.uuid}</div>
                                <div className="exam-foot">
                                    <div><span>{exam.release_flag === true ? '公開中' : '非公開'}</span></div>
                                    <div><span>{exam.question_count}問</span></div>
                                    <div><Link to={generateURL(URL.Manager._, URL.Manager.scoringExam) + '/' + exam.exam_id} className="text-link">採点</Link></div>
                                </div>
                            </section>
                        ))}
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ViewMyExams;