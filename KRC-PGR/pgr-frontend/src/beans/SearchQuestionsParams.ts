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