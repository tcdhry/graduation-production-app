package com.krc.pgr.bean;

import java.util.Map;

public class ClassBean {
    private int class_id;
    private String class_name;
    private int department_id;
    private String department_name;
    private int faculty_id;
    private String faculty_name;

    public ClassBean(int class_id, String class_name, int department_id, String department_name, int faculty_id, String faculty_name) {
        this.class_id = class_id;
        this.class_name = class_name;
        this.department_id = department_id;
        this.department_name = department_name;
        this.faculty_id = faculty_id;
        this.faculty_name = faculty_name;
    }

    public ClassBean(Map<String, Object> map) {
        this.class_id = (int) map.get("class_id");
        this.class_name = (String) map.get("class_name");
        this.department_id = (int) map.get("department_id");
        this.department_name = (String) map.get("department_name");
        this.faculty_id = (int) map.get("faculty_id");
        this.faculty_name = (String) map.get("faculty_name");
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
