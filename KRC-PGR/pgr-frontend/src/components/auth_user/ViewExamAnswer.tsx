import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { ResponseBase, receiveResponse, catchError } from "../../constants/ResponseStatus";
import { generateAPI, API, generateURL, URL } from "../../constants/URL";
import { AnswerData, AnswerView } from "./ViewAnswer";

function ViewExamAnswer() {
    const question_id = useParams().question_id;
    const exam_id = useParams().exam_id;

    const navigate = useNavigate();

    const [answerData, setAnswerData] = useState<undefined | AnswerData | null>();

    useEffect(() => {
        type ViewAnswerResponse = ResponseBase & {
            data: AnswerData
        };
        axios.get(generateAPI(API.User._, API.User.viewAnswer) + '/' + question_id).then((res: ViewAnswerResponse) => {
            receiveResponse(res, navigate, function () {
                if (res.data.success === true) {
                    setAnswerData(res.data);
                } else {
                    setAnswerData(null);
                }
            })
        }).catch(catchError);
    }, [question_id, navigate]);

    return (
        <div id="view-answer">
            <h2>提出した解答を確認</h2>
            <Link to={generateURL(URL.User._, URL.User.viewExam) + '/' + exam_id} className="btn btn-full">試験にもどる</Link>
            <br />
            <br />
            <AnswerView question_id={question_id} answerData={answerData} />
        </div>
    );
}

export default ViewExamAnswer;