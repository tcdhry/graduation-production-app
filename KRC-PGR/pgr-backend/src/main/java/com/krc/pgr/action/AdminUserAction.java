package com.krc.pgr.action;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.constant.Authority;
import com.krc.pgr.response.BulkRegUserResponse;
import com.krc.pgr.util.PasswordManage;

@Component
public class AdminUserAction {
    @Autowired
    JdbcTemplate jdbc;

    public BulkRegUserResponse bulkRegUser(Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> newUsers = (ArrayList<Map<String, Object>>) postParams.get("newUsers");

//        String sql = "select class_id from t_classes";
//        List<Map<String, Object>> list = jdbc.queryForList(sql);
//        List<Integer> class_ids = new ArrayList<>();
//        for (Map<String, Object> map : list) {
//            class_ids.add((int) map.get("class_id"));
//        }

        ArrayList<NewUserBean> newUsersData = new ArrayList<>();
        for (Map<String, Object> map : newUsers) {
            String tmp = (String) map.get("user_id");
            int user_id = -1;
            try {
                user_id = Integer.parseInt(tmp);
            } catch (Exception e) {
                // user_id format error
            }

            String user_name = (String) map.get("user_name");
            if (user_name == null || "".equals(user_name)) {
                // user_name not input error
            }

            String view_name = (String) map.get("view_name");
            if ("".equals(view_name)) {
                view_name = null;
            }

            String password = (String) map.get("password");
            if (password.length() < 10) {
                // password shorter error
            }

            String password_hash = PasswordManage.hash(password);
            tmp = (String) map.get("authority_id");
            int authority_id;
            try {
                authority_id = Integer.parseInt(tmp);
                if (authority_id == Authority.USER.getAuthority() || authority_id == Authority.MANAGER.getAuthority() || authority_id == Authority.ADMIN.getAuthority()) {
                    // authoirty_id not found error
                }
            } catch (Exception e) {
                // authority_id format error
            }

            tmp = (String) map.get("class_id");
            Integer class_id = null;
            if ("".equals(tmp)) {
                class_id = null;
            } else {
                try {
                    class_id = Integer.parseInt(tmp);
                } catch (Exception e) {
                    // class_id format error
                }
            }

            tmp = (String) map.get("student_number");
            Integer student_number = null;
            if ("".equals(tmp)) {
                student_number = null;
            } else {
                try {
                    student_number = Integer.parseInt(tmp);
                } catch (Exception e) {
                    // student_number format error
                }
            }

            newUsersData.add(new NewUserBean(user_id, user_name, view_name, password_hash, class_id, student_number));
        }
        return null;
    }
}

class NewUserBean {
    private int user_id;
    private String user_name;
    private String view_name;
    private String password_hash;
    private Integer class_id;
    private Integer student_number;

    public NewUserBean(int user_id, String user_name, String view_name, String password_hash, Integer class_id, Integer student_number) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.view_name = view_name;
        this.password_hash = password_hash;
        this.class_id = class_id;
        this.student_number = student_number;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public String getView_name() {
        return view_name;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public Integer getClass_id() {
        return class_id;
    }

    public Integer getStudent_number() {
        return student_number;
    }
}
