package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.UserProfileAction;
import com.krc.pgr.aspect.Permit;
import com.krc.pgr.constant.Authority;
import com.krc.pgr.response.ResponseBase;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/user")
@Permit(authority = { Authority.USER, Authority.MANAGER, Authority.ADMIN })
public class UserController {
    @Autowired
    UserProfileAction userProfileAction;

    @PutMapping("/changeViewName")
    public ResponseBase changeViewName(@RequestBody Map<String, Object> putParams) {
        return userProfileAction.changeViewName(putParams);
    }

    @PutMapping("/changePassword")
    public ResponseBase changePassword(@RequestBody Map<String, Object> putParams) throws Exception {
        return userProfileAction.changePassword(putParams);
    }
}
