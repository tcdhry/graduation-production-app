enum AdminURL {
    _ = 'admin',
    index = '',
    bulkRegUser = 'bulkRegUser',
    AccountManage = 'AccountManage',
}

enum ManagerURL {
    _ = 'manager',
    index = '',
    postQuestion = 'postQuestion',
    viewMyQuestions = 'viewMyQuestions',
    editQuestion = 'editQuestion',
    postExam = 'postExam',
    viewMyExams = 'viewMyExams',
    editExam = 'editExam',
}

enum UserURL {
    _ = 'user',
    index = '',
    profile = 'profile',
    ranking = 'ranking',
    selectStyle = 'selectStyle',
    viewQuestions = 'viewQuestions',
    viewQuestion = 'viewQuestion',
    referAnswer = 'referAnswer'
}

enum GuestURL {
    login = 'login',
    sessionError = 'sessionError',
    insufficientAuthorityError = 'insufficientAuthorityError',

}

export class URL {
    public static Head = 'krcpgr'
    public static Admin = AdminURL;
    public static Manager = ManagerURL;
    public static User = UserURL;
    public static Guest = GuestURL;
}

export function generateURL(...args: Array<AdminURL | ManagerURL | UserURL | GuestURL>) {
    return `/${URL.Head}/${args.join('/')}`;
}

enum AdminAPI {
    _ = 'admin',

}

enum ManagerAPI {
    _ = 'manager',

}

enum UserAPI {
    _ = 'user',

}

enum GuestAPI {
    login = 'login',
    sessionCheck = 'sessionCheck',
    logout = 'logout',

}

export class API {
    public static Admin = AdminAPI;
    public static Manager = ManagerAPI;
    public static User = UserAPI;
    public static Guest = GuestAPI;
};

export function generateAPI(...args: Array<AdminAPI | ManagerAPI | UserAPI | GuestAPI>) {
    return `/${args.join('/')}`;
}