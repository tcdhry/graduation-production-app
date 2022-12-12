package com.krc.pgr.action;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import com.krc.pgr.bean.UserBean;
import com.krc.pgr.response.LoginResponse;
import com.krc.pgr.response.SessionCheckResponse;
import com.krc.pgr.util.PasswordManage;
import com.krc.pgr.util.SessionManage;

@Component
public class LoginAction {
    @Autowired
    SessionManage session;

    @Autowired
    JdbcTemplate jdbc;

    public LoginResponse login(@RequestBody Map<String, Object> postParams) {
        /**
         * ログイン成功時、ユーザ情報を返す。
         * 失敗時は失敗フラグのみを返し、セキュリティの観点から要因は返さない。
         */
        int user_id;
        try {
            user_id = Integer.parseInt(postParams.get("user_id").toString());
        } catch (Exception e) {
            return new LoginResponse();
        }

        String password_hash;
        try {
            password_hash = PasswordManage.hash(postParams.get("password").toString());
        } catch (Exception e) {
            return new LoginResponse();
        }

        String sql = "select * from v_users where user_id = ? and password_hash = ?;";

        List<Map<String, Object>> list = jdbc.queryForList(sql, user_id, password_hash);

        if (list.size() == 0) {
            return new LoginResponse();
        }

        UserBean loginUser = new UserBean(list.get(0));

        session.setLoginUser(loginUser);
        return new LoginResponse(loginUser);
    }

    public void logout() {
        session.removeLoginUser();
    }

    public SessionCheckResponse sessionCheck() {
        return new SessionCheckResponse(session.getLoginUser());
    }
}
