import { ExecStatusCode } from "../constants/ExecStatus";

export type ExecStatus = {
    execStatusCode: ExecStatusCode
    output: string,
    execTime: number
};

export enum ExecConfirmStatus {
    SUCCESS = 0,
    NOT_FOUND = 1,
    NOT_VIEWING_SESSION = 2,
    SOURCE_CODE_NOT_INPUT = 3,
    LANGUAGE_ERROR = 4,
};

export enum AnswerConfirmStatus {
    SUCCESS = 0,
    NOT_FOUND = 1,
    NOT_VIEWING_SESSION = 2,
    SOURCE_CODE_NOT_INPUT = 3,
    LANGUAGE_ERROR = 4,
};
