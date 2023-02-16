package com.krc.pgr.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.krc.pgr.bean.ClassBean;
import com.krc.pgr.response.GetClassesCompositionResponse;
import com.krc.pgr.response.GetClassesResponse;
import com.krc.pgr.response.SuccessFlagResponse;

@Component
public class AdminClassAction {
    @Autowired
    JdbcTemplate jdbc;

    @Autowired
    DataSource dataSource;

    public GetClassesResponse getClasses() {
        /**
         * v_classesから取得
         * inner join で取得するため、クラスが存在しない学科、分類は取得されない
         */
        String sql = "select * from v_classes";
        List<Map<String, Object>> list = jdbc.queryForList(sql);
        ArrayList<ClassBean> classes = new ArrayList<>();
        for (Map<String, Object> map : list) {
            classes.add(new ClassBean(map));
        }
        return new GetClassesResponse(classes);
    }

    public GetClassesCompositionResponse getClassesComposition() {
        /**
         * getClasses()とは違い
         * outer join で取得するため、クラスが存在しない学科、分類も全て取得される
         */
        String sql = "select * from m_faculties as f left outer join m_departments as d on f.faculty_id = d.faculty_id left outer join m_classes as c on d.department_id = c.department_id order by reverse(c.class_name);";
        List<Map<String, Object>> classes = jdbc.queryForList(sql);

        return new GetClassesCompositionResponse(classes);
    }

    public SuccessFlagResponse newDepartment(Map<String, Object> postParams) {
        int department_id = (int) postParams.get("department_id");
        String department_name = (String) postParams.get("department_name");
        int faculty_id = (int) postParams.get("faculty_id");

        if (department_name == null) {
            return SuccessFlagResponse.error();
        }

        String sql = "select * from m_departments where department_id = ? or department_name = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, department_id, department_name);

        if (list.size() != 0) {
            return SuccessFlagResponse.error();
        }

        sql = "select * from m_faculties where faculty_id = ?;";
        list = jdbc.queryForList(sql, faculty_id);

        if (list.size() == 0) {
            return SuccessFlagResponse.error();
        }

        sql = "insert into m_departments(department_id, department_name, faculty_id) values(?, ?, ?);";
        jdbc.update(sql, department_id, department_name, faculty_id);

        return SuccessFlagResponse.success();
    }

    public SuccessFlagResponse newClass(Map<String, Object> postParams) {
        int class_id = (int) postParams.get("class_id");
        String class_name = (String) postParams.get("class_name");
        int department_id = (int) postParams.get("department_id");

        if (class_name == null) {
            return SuccessFlagResponse.error();
        }

        String sql = "select * from m_classes where class_id = ? or class_name = ?;";
        List<Map<String, Object>> list = jdbc.queryForList(sql, class_id, class_name);

        if (list.size() != 0) {
            return SuccessFlagResponse.error();
        }

        sql = "select * from m_departments where department_id = ?;";
        list = jdbc.queryForList(sql, department_id);

        if (list.size() == 0) {
            return SuccessFlagResponse.error();
        }

        sql = "insert into m_classes(class_id, class_name, department_id) values(?, ?, ?);";
        jdbc.update(sql, class_id, class_name, department_id);

        return SuccessFlagResponse.success();
    }

    public SuccessFlagResponse updateFaculties(Map<String, Object> postParams) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> new_faculties = (List<Map<String, Object>>) postParams.get("new_faculties");

        if (new_faculties.size() == 0) {
            return SuccessFlagResponse.error();
        }
        /*
         * "case " + when + " else faculty_name end"
         * when = " when faculty_id = ? then ? " をsize分
         */
        List<Object> sqlParams = new ArrayList<>();
        final String WHEN = " when ? then ? ";
        String when = "";
        for (Map<String, Object> faculty : new_faculties) {
            when += WHEN;
            sqlParams.add(faculty.get("faculty_id"));
            sqlParams.add(faculty.get("new_faculty_name"));
        }

        String sql = "update m_faculties set faculty_name = case faculty_id " + when + " else faculty_name end;";

        String tmp = sql;
        for (Object o : sqlParams) {
            tmp = tmp.replaceFirst("\\?", o.toString());
        }
        System.out.println(tmp);

        jdbc.update(sql, sqlParams.toArray());

        return SuccessFlagResponse.success();
    }

    public SuccessFlagResponse updateDepartments(Map<String, Object> postParams) {
        /**
         * 不正値はsqlのエラーで弾く
         * faculty_id: foreign key制約違反
         * department_name: unique制約違反
         * 存在しないdepartment_id: caseでヒットしないため影響なし
         */

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> new_departments = (List<Map<String, Object>>) postParams.get("new_departments");

        if (new_departments.size() == 0) {
            return SuccessFlagResponse.error();
        }

        final String WHEN = " when ? then ? ";
        String when = "";

        Object[] sqlParams = new Object[new_departments.size() * 4];

        int i = 0, j = new_departments.size() * 2;
        for (Map<String, Object> dep : new_departments) {
            when += WHEN;

            sqlParams[i++] = dep.get("department_id");
            sqlParams[i++] = dep.get("new_department_name");
            sqlParams[j++] = dep.get("department_id");
            sqlParams[j++] = dep.get("new_faculty_id");
        }

        String setDepartment_name = "department_name = case department_id " + when + " else department_name end ";
        String setFaculty_id = "faculty_id = case department_id " + when + " else faculty_id end ";
        String sql = "update m_departments set " + setDepartment_name + " , " + setFaculty_id + ";";

//        String tmp = sql;
//        for (Object o : sqlParams) {
//            System.out.println(o);
//            tmp = tmp.replaceFirst("\\?", o.toString());
//        }
//        System.out.println(tmp);

        jdbc.update(sql, sqlParams);

        return SuccessFlagResponse.success();
    }

    public SuccessFlagResponse updateClasses(Map<String, Object> postParams) {
        /**
         * 不正値はsqlのエラーで弾く
         * department_id: foreign key制約違反
         * class_name: unique制約違反
         * 存在しないclass_id: caseでヒットしないため影響なし
         */
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> new_classes = (List<Map<String, Object>>) postParams.get("new_classes");

        if (new_classes.size() == 0) {
            return SuccessFlagResponse.error();
        }

        Object[] sqlParams = new Object[new_classes.size() * 4];

        final String WHEN = " when ? then ? ";
        String when = "";

        int i = 0, j = new_classes.size() * 2;
        for (Map<String, Object> cls : new_classes) {
            when += WHEN;

            sqlParams[i++] = cls.get("class_id");
            sqlParams[i++] = cls.get("new_class_name");
            sqlParams[j++] = cls.get("class_id");
            sqlParams[j++] = cls.get("new_department_id");
        }

        String setClass_name = "class_name = case class_id " + when + " else class_name end ";
        String setDepartment_id = "department_id = case class_id " + when + " else department_id end ";
        String sql = "update m_classes set " + setClass_name + " , " + setDepartment_id + ";";

        jdbc.update(sql, sqlParams);

        return SuccessFlagResponse.success();
    }
}
