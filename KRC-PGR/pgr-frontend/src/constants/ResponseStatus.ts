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
} & {
    request?: {
        responseURL?: string
    }
};

export function receiveResponse(res: ResponseBase, navigate: NavigateFunction, then: Function) {
    logResponse(res);
    switch (res.data.status) {
        case Status.SessionError:
            navigate(generateURL(URL.Guest.sessionError));
            break;
        case Status.RunTimeError:
            alert('処理中にエラーが発生しました。');
            break;
        case Status.InsufficientAuthority:
            navigate(generateURL(URL.Guest.insufficientAuthorityError));
            break;
        case Status.Success:
            then();
            break;
    }
}

export function catchError(err: any) {
    /**
     * 初期アクセス時には正常だが、その後にサーバがダウンしたときの処理。
     */
    console.error(err);
    alert(
        'サーバの応答が停止している可能性があります。'
    );
}

export function logResponse(res: ResponseBase) {
    const now = new Date();
    console.log([now.toLocaleTimeString() + '.' + now.getMilliseconds().toString().substring(0, 2), res.request!.responseURL!.replace(/http:\/\/[\d.:]+/g, ''), res]);
}

/** 基本形
type XXXXXResponse = ResponseBase & {
    data: {

    }
}
axios.get(generateAPI(API.User._, API.User.xxxxx)).then((res: XXXXXResponse) => {
    receiveResponse(res, navigate, function () {
        
    });
}).catch(catchError);
 */