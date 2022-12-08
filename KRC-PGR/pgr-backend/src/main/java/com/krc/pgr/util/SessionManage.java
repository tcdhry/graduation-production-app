package com.krc.pgr.util;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.UserBean;

@Component
public class SessionManage {
    @Autowired
    HttpSession session;

    final private String LOGIN_USER_KEY = "user";

    public UserBean getLoginUser() {
        return (UserBean) session.getAttribute(LOGIN_USER_KEY);
    }

    public void setLoginUser(UserBean loginUser) {
        session.setAttribute(LOGIN_USER_KEY, loginUser);
    }

    public void removeLoginUser() {
        session.removeAttribute(LOGIN_USER_KEY);
    }
}
