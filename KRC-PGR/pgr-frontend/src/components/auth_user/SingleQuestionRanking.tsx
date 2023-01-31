import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";
import { API, generateAPI } from "../../constants/URL";

function SingleQuestionRanking() {
    const question_id = useParams().question_id;
    const navigate = useNavigate();

    useEffect(() => {
        type RankingResponse = ResponseBase & {
            data: {

            }
        };
        axios.get(generateAPI(API.User._, API.User.ranking) + '/' + question_id).then((res: RankingResponse) => {
            receiveResponse(res, navigate, function () {
                
            });
        }).catch(catchError);
    }, []);

    return (
        <>

        </>
    );
}

export default SingleQuestionRanking;