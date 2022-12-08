package com.krc.pgr.response;

import com.krc.pgr.bean.UserBean;

public class LoginResponse extends ResponseBase {
    private UserBean user;

    public LoginResponse() {
        this.user = null;
    }

    public LoginResponse(UserBean user) {
        this.user = user;
    }

    public UserBean getUser() {
        return user;
    }
}
