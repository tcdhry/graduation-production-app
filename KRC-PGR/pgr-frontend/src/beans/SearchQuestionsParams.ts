export class TF {
    t: boolean = true;
    f: boolean = true;
}
export type SearchQuestionsParams = {
    title: string,
    poster_id: string,
    language: Array<string>,
    scoring: TF,
    answered: TF,
    password: TF,
    sort: 'new' | 'old',
    page: number
};

export function switchTF(tfString: string, errorFlag: { flag: boolean }): TF {
    switch (tfString) {
        case 'tf':
            return { t: true, f: true };
        case 't':
            return { t: true, f: false };
        case 'f':
            return { t: false, f: true };
        case '':
            return { t: false, f: false };
        default:
            // input value Error
            errorFlag.flag = true;
            return { t: true, f: true };
    }
}