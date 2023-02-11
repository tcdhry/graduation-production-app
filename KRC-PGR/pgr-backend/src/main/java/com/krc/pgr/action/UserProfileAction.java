package com.krc.pgr.action;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.constant.ChangePasswordStatus;
import com.krc.pgr.constant.ChangeViewNameStatus;
import com.krc.pgr.response.ChangePasswordResponse;
import com.krc.pgr.response.ChangeViewNameResponse;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class UserProfileAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    public ChangeViewNameResponse changeViewName(Map<String, Object> putParams) {
        String new_view_name = putParams.get("new_view_name").toString();
        if (new_view_name.length() > 20) {
            // longer err
            return new ChangeViewNameResponse(ChangeViewNameStatus.LONGER);
        } else if ("".equals(new_view_name)) {
            new_view_name = null;
        } else if (new_view_name.replaceAll("\s", "").length() == 0) {
            // only whitespace only err
            return new ChangeViewNameResponse(ChangeViewNameStatus.WHITESPACE_ONLY);
        }
        int user_id = session.getLoginUser().getUser_id();

        String sql = "update m_users set view_name = ? where user_id = ?;";
        jdbc.update(sql, new_view_name, user_id);
        session.getLoginUser().setView_name(new_view_name);

        return new ChangeViewNameResponse();
    }

    public ChangePasswordResponse changePassword(Map<String, Object> putParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        String password = putParams.get("password").toString();
        String password_check = putParams.get("password_check").toString();

        if (password.length() == 0) {
            return new ChangePasswordResponse(ChangePasswordStatus.NOT_ENTER);
        } else if (!password.equals(password_check)) {
            return new ChangePasswordResponse(ChangePasswordStatus.NOT_MATCH);
        } else if (password.length() < 10) {
            return new ChangePasswordResponse(ChangePasswordStatus.SHORTER);
        }
        String password_hash = PasswordManage.hash(password);
        String sql = "update m_users set password_hash = ? where user_id = ?;";

        jdbc.update(sql, password_hash, session.getLoginUser().getUser_id());

        return new ChangePasswordResponse();
    }
}
