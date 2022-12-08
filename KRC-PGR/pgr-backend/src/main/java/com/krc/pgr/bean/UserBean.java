package com.krc.pgr.bean;

import java.util.Map;

public class UserBean {
    private int user_id;
    private String user_name;
    private String view_name;
    private int authority_id;
    private String authority_name;
    private HomeroomClass homeroom_class;
    /*
     * DB定義でnot null制約を掛けていないため、nullがあり得る。
     * (教員の場合はnullの想定)
     * そのため、intではなくnullを格納できるInteger型を使う。
     */
    private Integer student_number;

    public UserBean(Map<String, Object> map) {
        /**
         * SQLの結果からインスタンスを作成する。
         * DBの制約から、ぬるぽが発生しないであろう項目は
         * 特にエラー処理をしない。
         */
        int user_id = Integer.parseInt(map.get("user_id").toString());
        String user_name = map.get("user_name").toString();

        String view_name;
        try {
            view_name = map.get("view_name").toString();
        } catch (Exception e) {
            view_name = null;
        }
        int authority_id = Integer.parseInt(map.get("authority_id").toString());
        String authority_name = map.get("authority_name").toString();

        this.user_id = user_id;
        this.user_name = user_name;
        this.view_name = view_name;
        this.authority_id = authority_id;
        this.authority_name = authority_name;

        try {
            int class_id = Integer.parseInt(map.get("class_id").toString());
            String class_name = map.get("class_name").toString();
            int department_id = Integer.parseInt(map.get("department_id").toString());
            String department_name = map.get("department_name").toString();
            int faculty_id = Integer.parseInt(map.get("faculty_id").toString());
            String faculty_name = map.get("faculty_name").toString();

            this.homeroom_class = new HomeroomClass(class_id, class_name, department_id, department_name, faculty_id, faculty_name);
        } catch (Exception e) {
            /**
             * class_id が nullの場合、以下に到達
             */
            this.homeroom_class = null;
        }

        try {
            this.student_number = Integer.parseInt(map.get("student_number").toString());
        } catch (Exception e) {
            this.student_number = null;
        }
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

    public int getAuthority_id() {
        return authority_id;
    }

    public String getAuthority_name() {
        return authority_name;
    }

    public HomeroomClass getHomeroom_class() {
        return homeroom_class;
    }

    public Integer getStudent_number() {
        return student_number;
    }
}

class HomeroomClass {
    private int class_id;
    private String class_name;
    private int department_id;
    private String department_name;
    private int faculty_id;
    private String faculty_name;

    public HomeroomClass(int class_id, String class_name, int department_id, String department_name, int faculty_id, String faculty_name) {
        this.class_id = class_id;
        this.class_name = class_name;
        this.department_id = department_id;
        this.department_name = department_name;
        this.faculty_id = faculty_id;
        this.faculty_name = faculty_name;
    }

    public int getClass_id() {
        return class_id;
    }

    public String getClass_name() {
        return class_name;
    }

    public int getDepartment_id() {
        return department_id;
    }

    public String getDepartment_name() {
        return department_name;
    }

    public int getFaculty_id() {
        return faculty_id;
    }

    public String getFaculty_name() {
        return faculty_name;
    }
}