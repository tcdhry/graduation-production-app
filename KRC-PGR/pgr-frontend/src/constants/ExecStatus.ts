export class ExecStatus {
    private _statusCode: number;
    private _statusName: string;
    private _description: string;

    constructor(_statusCode: number, _statusName: string, _description: string) {
        this._statusCode = _statusCode;
        this._statusName = _statusName;
        this._description = _description;
    }

    public get statusCode(): number {
        return this._statusCode;
    }
    public get statusName(): string {
        return this._statusName;
    }
    public get description(): string {
        return this._description;
    }
}

export enum ExecStatusCode {
    Accepted = 0,
    CompilationError = 1,
    MemoryLimitExceeded = 2,
    TimeLimitExceeded = 3,
    RuntimeError = 4,
    OutputLimitExceeded = 5,
    InternalError = 6,
    WrongAnswer = 7
}

export const ExecStatuses: Array<ExecStatus> = [
    new ExecStatus(ExecStatusCode.Accepted, 'Accepted', '正答です。運営が用意したテストを全てパスし、正しいプログラムであると判定されました。'),
    new ExecStatus(ExecStatusCode.CompilationError, 'Compilation Error', '提出されたプログラムのコンパイルに失敗しました。'),
    new ExecStatus(ExecStatusCode.MemoryLimitExceeded, 'Memory Limit Exceeded', '問題で指定されたメモリ制限を超えています。'),
    new ExecStatus(ExecStatusCode.TimeLimitExceeded, 'Time Limit Exceeded', '問題で指定された実行時間以内にプログラムが終了しませんでした。'),
    new ExecStatus(ExecStatusCode.RuntimeError, 'Runtime Error', 'プログラムの実行中にエラーが発生しました。コンパイル時に検知できなかったエラーがあります.スタックオーバーフロー、ゼロ除算などが原因です.'),
    new ExecStatus(ExecStatusCode.OutputLimitExceeded, 'Output Limit Exceeded', '問題で指定された制限を超えるサイズの出力を行いました。'),
    new ExecStatus(ExecStatusCode.InternalError, 'Internal Error', '内部のエラー、つまりジャッジシステムのエラーです。'),
    new ExecStatus(ExecStatusCode.WrongAnswer, 'Wrong Answer', '誤答です。提出したプログラムの出力は正しくありません。'),
];