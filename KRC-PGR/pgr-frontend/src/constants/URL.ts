enum AdminURL {
    _ = 'admin',
    index = '',
    bulkRegUser = 'bulkRegUser',
    accountManage = 'AccountManage',
    styleManage = 'styleManage',
    classManage = 'classManage',
    newClass = 'newClass',
    updateClass = 'updateClass',
}

enum ManagerURL {
    _ = 'manager',
    index = '',
    postQuestion = 'postQuestion',
    postQuestionSuccess = 'postQuestionSuccess',
    viewMyQuestions = 'viewMyQuestions',
    editQuestion = 'editQuestion',
    editQuestionIO = 'editQuestionIO',
    viewAnswers = 'viewAnswers',
    postExam = 'postExam',
    viewMyExams = 'viewMyExams',
    editExam = 'editExam',
    scoringExam = 'scoringExam'
}

enum UserURL {
    _ = 'user',
    index = '',
    profile = 'profile',
    ranking = 'ranking',
    selectStyle = 'selectStyle',
    viewQuestions = 'viewQuestions',
    viewQuestion = 'viewQuestion',
    referAnswer = 'referAnswer',
    viewExam = 'viewExam',
    viewAnswer = 'viewAnswer',
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
    getStyles = 'getStyles',
    updateStyle = 'updateStyle',
    getClasses = 'getClasses',
    bulkRegUser = 'bulkRegUser',
    getClassesComposition = 'getClassesComposition',
    newDepartment = 'newDepartment',
    newClass = 'newClass',
    updateFaculties = 'updateFaculties',
    updateDepartments = 'updateDepartments',
    updateClasses = 'updateClasses',
}

enum ManagerAPI {
    _ = 'manager',
    postQuestion = 'postQuestion',
    titleCheck = 'titleCheck',
    viewMyQuestions = 'viewMyQuestions',
    editQuestion = 'editQuestion',
    editQuestionIO = 'editQuestionIO',
    viewAnswers = 'viewAnswers',
    downloadAnswers = 'downloadAnswers',
    viewAnswer = 'viewAnswer',
    getMyAllQuestions = 'getMyAllQuestions',
    postExam = 'postExam',
    getMyExam = 'getMyExam',
    getMyExams = 'getMyExams',
    editExam = 'editExam',
    scoringExam = 'scoringExam',
    downloadExamAnswers = 'downloadExamAnswers',
}

enum UserAPI {
    _ = 'user',
    changeViewName = 'changeViewName',
    changePassword = 'changePassword',
    questions = 'questions',
    question = 'question',
    questionWithPassword = 'questionWithPassword',
    execConfirm = 'execConfirm',
    answerConfirm = 'answerConfirm',
    selectStyle = 'selectStyle',
    viewAnswer = 'viewAnswer',
    ranking = 'ranking',
    viewExam = 'viewExam',
    viewExamQuestion = 'viewExamQuestion',
}

enum GuestAPI {
    login = 'login',
    sessionCheck = 'sessionCheck',
    logout = 'logout',
    getStyle = 'getStyle',
}

export class API {
    public static Admin = AdminAPI;
    public static Manager = ManagerAPI;
    public static User = UserAPI;
    public static Guest = GuestAPI;
};

type APItypes = AdminAPI | ManagerAPI | UserAPI | GuestAPI;

export function generateAPI(...args: Array<APItypes>) {
    return `/${args.join('/')}`;
}
