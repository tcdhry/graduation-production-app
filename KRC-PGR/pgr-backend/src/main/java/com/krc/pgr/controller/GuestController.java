package com.krc.pgr.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.GuestStyleAction;
import com.krc.pgr.action.LoginAction;
import com.krc.pgr.aspect.Permit;
import com.krc.pgr.constant.Authority;
import com.krc.pgr.response.ResponseBase;

@RestController
@Permit(authority = { Authority.GUEST, Authority.USER, Authority.MANAGER, Authority.ADMIN })
public class GuestController {
    @Autowired
    LoginAction loginAction;

    @Autowired
    GuestStyleAction guestStyleAction;

    @PostMapping("/login")
    public ResponseBase login(@RequestBody Map<String, Object> postParams) {
        /**
         * @return LoginResponse extends ResponseBase
         * 
         * @param user_id:  String
         * @param password: String
         */
        return loginAction.login(postParams);
    }

    @GetMapping("/logout")
    public void logout() {
        /**
         * @return void
         */
        loginAction.logout();
    }

    @GetMapping("/sessionCheck")
    public ResponseBase sessionCheck() {
        /**
         * @return SessionCheckResponse extends ResponseBase
         */
        return loginAction.sessionCheck();
    }

    @GetMapping("getStyle/{styleName}")
    public ResponseBase getStyle(@PathVariable String styleName) {
        return guestStyleAction.getStyle(styleName);
    }
}
