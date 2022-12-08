package com.krc.pgr.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.LoginAction;
import com.krc.pgr.response.ResponseBase;

@RestController
public class LoginController {
    @Autowired
    LoginAction loginAction;

    @PostMapping("/login")
    public ResponseBase login(@RequestBody Map<String, Object> postParams) {
        return loginAction.login(postParams);
    }

    @GetMapping("/logout")
    public void logout() {
        loginAction.logout();
    }

    @GetMapping("/sessionCheck")
    public ResponseBase sessionCheck() {
        return loginAction.sessionCheck();
    }
}
