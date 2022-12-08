import { NavigateFunction } from "react-router-dom"
import { generateURL, URL } from "./URL"

export enum Status {
    Success = 0,
    SessionError = 1,
    RunTimeError = 2,
    InsufficientAuthority = 3
};

export type ResponseBase = {
    data: {
        status: number,
        errorMessage: string
    }
}

export function receiveResponse(res: ResponseBase, navigate: NavigateFunction, then: Function) {
    switch (res.data.status) {
        case Status.SessionError:
            navigate(generateURL(URL.Guest.sessionError));
            break;
        case Status.RunTimeError:
            alert('サーバでの処理中にエラーが発生しました。');
            break;
        case Status.InsufficientAuthority:
            navigate(generateURL(URL.Guest.insufficientAuthorityError));
            break;
        case Status.Success:
            then();
            break;
    }
}