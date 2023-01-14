import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { QuestionBean } from "../../beans/QuestionBean";
import { UserBean } from "../../beans/UserBean";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";
import { State } from "../../redux/store";
import NotFoundError from "../errors/NotFoundError";
import QuestionInputs, { TitleStatus } from "./manager_components/QuestionInputs";

function EditQuestion() {
    const params = useParams();
    const question_id = params.question_id;
    const navigate = useNavigate();
    const user = useSelector((state: State) => state.loginUser.user);
    const [question, setQuestion] = useState<QuestionBean>(new QuestionBean(user as UserBean));
    const [viewFlag, setViewFlag] = useState<undefined | null | true>(undefined);
    const [titleStatus, setTitleStatus] = useState(TitleStatus.DefaultTitle);
    const [submitError, setSubmitError] = useState<JSX.Element | null>(null);

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
    }, []);

    if (viewFlag === undefined) {
        return (
            <></>
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
            <QuestionInputs
                question={question}
                setQuestion={setQuestion}
                titleStatus={titleStatus}
                setTitleStatus={setTitleStatus}
            />
        </>
    );
}

export default EditQuestion;