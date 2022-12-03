export class Language {
    private _language_id: number;
    private _language_name: string;

    constructor(_language_id: number, _language_name: string) {
        this._language_id = _language_id;
        this._language_name = _language_name;
    }

    public get language_id(): number {
        return this._language_id;
    }
    public get language_name(): string {
        return this._language_name;
    }
}

export enum LanguageCode {
    Java = 1,
    CPlusPlus = 4,
    CSharp = 3,
    Python = 2,
    Ruby = 5
}

export const Languages: Array<Language> = [
    new Language(LanguageCode.Java, 'Java'),
    new Language(LanguageCode.CPlusPlus, 'C++'),
    new Language(LanguageCode.CSharp, 'C#'),
    new Language(LanguageCode.Python, 'Python'),
    new Language(LanguageCode.Ruby, 'Ruby'),
]