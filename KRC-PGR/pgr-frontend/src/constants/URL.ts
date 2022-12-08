enum AdminURL {
    _ = 'admin',
    index = '',

}

enum ManagerURL {
    _ = 'manager',
    index = '',

}

enum UserURL {
    _ = 'user',
    index = '',

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