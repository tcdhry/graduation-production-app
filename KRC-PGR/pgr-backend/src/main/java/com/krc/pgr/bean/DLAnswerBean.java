package com.krc.pgr.bean;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.krc.pgr.constant.Language;
import com.krc.pgr.constant.SourceFileName;
import com.krc.pgr.util.FileManage;

public class DLAnswerBean {
    private int user_id;
    private String user_name;
    private Integer student_number;
    private Integer class_id;
    private String class_name;
    private Integer department_id;
    private String department_name;
    private Integer faculty_id;
    private String faculty_name;
    private String file_name;
    private String source_code;
    private List<DLOutputBean> outputs;

    public DLAnswerBean(Map<String, Object> map, int question_id) throws IOException {
        this.user_id = (int) map.get("user_id");
        this.user_name = (String) map.get("user_name");
        this.student_number = (Integer) map.get("student_number");
        this.class_id = (Integer) map.get("class_id");
        this.class_name = (String) map.get("class_name");
        this.department_id = (Integer) map.get("department_id");
        this.department_name = (String) map.get("department_name");
        this.faculty_id = (Integer) map.get("faculty_id");
        this.faculty_name = (String) map.get("faculty_name");

        String dir = FileManage.generateSubmitFolderDirectory(question_id, (int) map.get("user_id"));
        String fn;
        if (map.get("select_language") == null) {
            fn = "source_code.txt";
        } else {
            fn = SourceFileName.search(Language.valueOf((Integer) map.get("select_language"))).getFileName();
        }
        this.file_name = fn;
        String path = dir + fn;
        this.source_code = FileManage.readFile(path);

        List<DLOutputBean> outputs = new ArrayList<>();
        int exec_count = (int) map.get("exec_count");
        for (int i = 0; i < exec_count; i++) {
            String outputPath = dir + "output" + i + ".txt";
            String output = FileManage.readFile(outputPath);
            outputs.add(new DLOutputBean(output));
        }
        this.outputs = outputs;
    }

    public int getUser_id() {
        return user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public Integer getStudent_number() {
        return student_number;
    }

    public Integer getClass_id() {
        return class_id;
    }

    public String getClass_name() {
        return class_name;
    }

    public Integer getDepartment_id() {
        return department_id;
    }

    public String getDepartment_name() {
        return department_name;
    }

    public Integer getFaculty_id() {
        return faculty_id;
    }

    public String getFaculty_name() {
        return faculty_name;
    }

    public String getFile_name() {
        return file_name;
    }

    public String getSource_code() {
        return source_code;
    }

    public List<DLOutputBean> getOutputs() {
        return outputs;
    }
}
