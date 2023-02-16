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
    final private String VIEWING_QUESTION_KEY = "viewing_question";
    final private String VIEWING_EXAM_KEY = "viewing_exam";

    public UserBean getLoginUser() {
        return (UserBean) session.getAttribute(LOGIN_USER_KEY);
    }

    public void setLoginUser(UserBean loginUser) {
        session.setAttribute(LOGIN_USER_KEY, loginUser);
    }

    public void logout() {
//        session.removeAttribute(LOGIN_USER_KEY);
        session.invalidate();
    }

//    public Integer getViewingQuestion_id() {
//        return (Integer) session.getAttribute(VIEWING_QUESTION_KEY);
//    }

    public void setViewingQuestion_id(int question_id) {
        session.setAttribute(VIEWING_QUESTION_KEY, question_id);
    }

    public boolean isViewingQuestion(int question_id) {
        Integer viewing = (Integer) session.getAttribute(VIEWING_QUESTION_KEY);
        if (viewing == null) {
            return false;
        }

        return viewing.intValue() == question_id;
    }

    public void setViewingExam_id(String exam_id) {
        /**
         * uuid込み
         */
        session.setAttribute(VIEWING_EXAM_KEY, exam_id);
    }

    public boolean isViewingExam(String exam_id) {
        return exam_id.equals((String) session.getAttribute(VIEWING_EXAM_KEY));
    }
}
