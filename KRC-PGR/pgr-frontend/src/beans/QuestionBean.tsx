import { getUserViewName, UserBean } from "./UserBean";

/**
 * 問題表示に必要な情報
 * 初期値とconstructorは投稿用
 */
export class QuestionBean {
    constructor(user: UserBean) {
        this.user_id = user.user_id;
        this.user_view_name = getUserViewName(user);
    }
    public question_id: string = '0';
    public question_title: string = '';
    public question_text: string = '';
    public input: string = '';
    public input_explain: string = '';
    public output: string = '';
    public output_explain: string = '';
    public inputs: [null | string, null | string, null | string] = [null, null, null];
    public outputs: [null | string, null | string, null | string] = [null, null, null];
    public io_explain: [null | string, null | string, null | string] = [null, null, null];
    public language_designation: number | null = null;
    public private_answer_mode: boolean = false;
    public release_flag: boolean = false;
    public scoring: boolean = false;
    public insert_datetime: string = function () {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = today.getMonth();
        const dd = today.getDate();
        const hh = today.getHours();
        const min = today.getMinutes();
        const ss = today.getSeconds();
        return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
    }();
    public user_id: string | undefined;
    public user_view_name: string | undefined;
    public answered: boolean = false;
}
// export class QuestionBean {
//     public question_id!: number;
//     public question_title!: string;
//     public question_text!: string;
//     public input!: string;
//     public input_explain!: string;
//     public output!: string;
//     public output_explain!: string;
//     public inputs!: [null | string, null | string, null | string];
//     public outputs!: [null | string, null | string, null | string];
//     public io_explain!: [null | string, null | string, null | string];
//     public language_designation!: number | null;
//     // public private_answer_mode!: boolean;
//     // public release_flag!: boolean;
//     public insert_datetime!: string;
//     public user_id!: number;
//     public user_view_name!: string;
// }

// export class QuestionInputsBean {
//     constructor(user: UserBean) {
//         this.user_id = user.user_id;
//         this.user_view_name = getUserViewName(user);
//     }
//     public question_id: number = 0;
//     public question_title: string = '';
//     public question_text: string = '';
//     public input: string = '';
//     public input_explain: string = '';
//     public output: string = '';
//     public output_explain: string = '';
//     public inputs: [null | string, null | string, null | string] = [null, null, null];
//     public outputs: [null | string, null | string, null | string] = [null, null, null];
//     public io_explain: [null | string, null | string, null | string] = [null, null, null];
//     public language_designation: number | null = null;
//     public private_answer_mode: boolean = false;
//     public release_flag: boolean = false;
//     public insert_datetime: string = function () {
//         const today = new Date();
//         const yyyy = today.getFullYear();
//         const mm = today.getMonth();
//         const dd = today.getDate();
//         const hh = today.getHours();
//         const min = today.getMinutes();
//         const ss = today.getSeconds();
//         return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
//     }();
//     public user_id: number | undefined;
//     public user_view_name: string | undefined;
// }

export type QuestionThumbnail = {
    question_id: number,
    question_title: string,
    language_designation: number | null,
    private_answer_mode: boolean,
    release_flag: boolean,
    answered: boolean,
    scoring: boolean,
    password_required: boolean,
    insert_timestamp: string,
    user_id: string | undefined,
    user_view_name: string | undefined,
}

export type Questions = Array<QuestionThumbnail>;