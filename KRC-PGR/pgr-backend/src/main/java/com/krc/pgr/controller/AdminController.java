package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.krc.pgr.action.AdminClassAction;
import com.krc.pgr.action.AdminStyleAction;
import com.krc.pgr.action.AdminUserAction;
import com.krc.pgr.aspect.Permit;
import com.krc.pgr.constant.Authority;
import com.krc.pgr.response.ResponseBase;

@RestController
@RequestMapping("/admin")
@Permit(authority = { Authority.ADMIN })
public class AdminController {
    @Autowired
    AdminStyleAction adminStyleAction;

    @Autowired
    AdminUserAction adminUserAction;

    @Autowired
    AdminClassAction adminClassAction;

    @GetMapping("/getStyles")
    public ResponseBase getStyles() {
        /**
         * @return StylesResponse extends ResponseBase
         */
        return adminStyleAction.getStyles();
    }

    @PostMapping("/updateStyle")
    public ResponseBase updateStyle(@RequestBody Map<String, Object> postParams) {
        /**
         * @params 諸々のCSS変数の値セット
         * 
         * @return StylesResponse extends ResponseBase
         */
        return adminStyleAction.updateStyle(postParams);
    }

    @GetMapping("/getClasses")
    public ResponseBase getClasses() {
        /**
         * @return GetClassesResponse extends ResponseBase
         */
        return adminClassAction.getClasses();
    }

    @GetMapping("/getClassesComposition")
    public ResponseBase getClassesComposition() {
        /**
         * @return GetClassesCompositionResponse extends ResponseBase
         */
        return adminClassAction.getClassesComposition();
    }

    @PostMapping("/newDepartment")
    public ResponseBase newDepartment(@RequestBody Map<String, Object> postParams) {
        /**
         * @param postParams: @RequestBody Map<String, Object>
         *                    - department_id: int
         *                    - department_name: String
         *                    - faculty_id: int
         * @return SuccessFlagResponse extends ResponseBase
         */
        return adminClassAction.newDepartment(postParams);
    }

    @PostMapping("/newClass")
    public ResponseBase newClass(@RequestBody Map<String, Object> postParams) {
        /**
         * @param postParams: @RequestBody Map<String, Object>
         *                    - class_id: int
         *                    - class_name: String
         *                    - department_id: int
         * @return SuccessFlagResponse extends ResponseBase
         */
        return adminClassAction.newClass(postParams);
    }

    @PostMapping("/updateFaculties")
    public ResponseBase updateFaculties(@RequestBody Map<String, Object> postParams) {
        /**
         * @param postParams: @RequestBody Map<String, Object>
         *                    - new_faculties: List<Map<String, Object>>
         *                    - - faculty_id: int
         *                    - - new_faculty_name: String
         * @return SuccessFlagResponse extends ResponseBase
         */
        return adminClassAction.updateFaculties(postParams);
    }

    @PostMapping("/updateDepartments")
    public ResponseBase updateDepartments(@RequestBody Map<String, Object> postParams) {
        /**
         * @param postParams: @RequestBody Map<String, Object>
         *                    - new_departments: List<Map<String, Object>>
         *                    - - department_id: int
         *                    - - new_department_name: String
         *                    - - faculty_id: int
         * @return SuccessFlagResponse extends ResponseBase
         */
        return adminClassAction.updateDepartments(postParams);
    }

    @PostMapping("/updateClasses")
    public ResponseBase updateClasses(@RequestBody Map<String, Object> postParams) {
        /**
         * @param postParams: @RequestBody Map<String, Object>
         *                    - new_classes: List<Map<String, Object>>
         *                    - - class_id: int
         *                    - - new_class_name: String
         *                    - - new_department_id: int
         * @return SuccessFlagResponse extends ResponseBase
         */
        return adminClassAction.updateClasses(postParams);
    }

    @PostMapping("/bulkRegUser")
    public ResponseBase bulkRegUser(@RequestBody Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        return adminUserAction.bulkRegUser(postParams);
    }
}
