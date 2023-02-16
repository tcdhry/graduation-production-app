import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionBean } from "../../beans/QuestionBean";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import Loading from "../errors/Loading";
import NotFoundError from "../errors/NotFoundError";
import { QuestionConfirmForm } from "./ViewQuestion";

function ViewExamQuestion() {
    const params = useParams();
    const exam_id = params.exam_id;
    const question_id = params.question_id;
    const navigate = useNavigate();
    const [question, setQuestion] = useState<QuestionBean | null>();

    useEffect(() => {
        type ViewExamQuestionResponse = ResponseBase & {
            data: {
                question: QuestionBean | null
            }
        }
        axios.get(`${generateAPI(API.User._, API.User.viewExamQuestion)}/${exam_id}/${question_id}`).then((res: ViewExamQuestionResponse) => {
            receiveResponse(res, navigate, function () {
                setQuestion(res.data.question);
            });
        }).catch(catchError);
    }, [exam_id, question_id, navigate]);

    if (question === undefined) {
        return (<Loading />);
    }

    if (question === null) {
        return (<NotFoundError />);
    }

    return (
        <>
            <QuestionConfirmForm question={question} exam_id={exam_id} />
        </>
    );
}

export default ViewExamQuestion;