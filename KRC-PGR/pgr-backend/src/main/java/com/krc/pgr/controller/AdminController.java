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

    @GetMapping("/getStyles")
    public ResponseBase getStyles() {
        return adminStyleAction.getStyles();
    }

    @PostMapping("/updateStyle")
    public ResponseBase updateStyle(@RequestBody Map<String, Object> postParams) {
        return adminStyleAction.updateStyle(postParams);
    }

    @GetMapping("/getClasses")
    public ResponseBase getClasses() {
        return adminUserAction.getClasses();
    }

    @PostMapping("/bulkRegUser")
    public ResponseBase bulkRegUser(@RequestBody Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        return adminUserAction.bulkRegUser(postParams);
    }
}
