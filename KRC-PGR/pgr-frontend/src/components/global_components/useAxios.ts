import axios from "axios";
import { useNavigate } from "react-router-dom";
import { catchError, receiveResponse, ResponseBase } from "../../constants/ResponseStatus";

export class Axios {
    static useGet(): (url: string, then: Function, params?: any) => void {
        const navigate = useNavigate();

        function get(url: string, then: Function, params?: any) {
            axios.get(url, { params: params }).then((res: ResponseBase) => {
                receiveResponse(res, navigate, then);
            }).catch(catchError);
        }

        return get;
    }

    static usePost(): (url: string, then: Function, params: { [key: string | number | symbol]: any }) => void {
        const navigate = useNavigate();

        function post(url: string, then: Function, params: { [key: string | number | symbol]: any }) {
            axios.post(url, params).then((res: ResponseBase) => {
                receiveResponse(res, navigate, then);
            }).catch(catchError);
        }

        return post;
    }

    static use() {
        return {
            get: Axios.useGet(),
            post: Axios.usePost()
        };
    }
}