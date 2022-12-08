package com.krc.pgr.response;

import com.krc.pgr.bean.UserBean;

public class SessionCheckResponse extends ResponseBase {
    // セッション情報が存在しなければnullが格納される
    UserBean user;

    public SessionCheckResponse(UserBean user) {
        this.user = user;
    }

    public UserBean getUser() {
        return user;
    }
}
