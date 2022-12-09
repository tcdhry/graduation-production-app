export enum AuthorityID {
    Admin = 0,
    Manager = 1,
    User = 2
}

export enum AuthorityName {
    Admin = 'admin',
    Manager = 'manager',
    User = 'user'
}

export enum AuthorityJapaneseName {
    Admin = '管理者',
    Manager = '運営者',
    User = 'ユーザ'
}

export class Authority {
    public static Admin = {
        id: AuthorityID.Admin,
        name: AuthorityName.Admin,
        ja: AuthorityJapaneseName.Admin,
    }
    public static Manager = {
        id: AuthorityID.Manager,
        name: AuthorityName.Manager,
        ja: AuthorityJapaneseName.Manager,
    }
    public static User = {
        id: AuthorityID.User,
        name: AuthorityName.User,
        ja: AuthorityJapaneseName.User,
    }
}