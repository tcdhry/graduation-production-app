package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.UserProfileAction;
import com.krc.pgr.action.UserQuestionAction;
import com.krc.pgr.aspect.Permit;
import com.krc.pgr.constant.Authority;
import com.krc.pgr.response.ResponseBase;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/user")
@Permit(authority = { Authority.USER, Authority.MANAGER, Authority.ADMIN })
public class UserController {
    @Autowired
    UserProfileAction userProfileAction;

    @Autowired
    UserQuestionAction userQuestionAction;

    @PutMapping("/changeViewName")
    public ResponseBase changeViewName(@RequestBody Map<String, Object> putParams) {
        /**
         * @return ChangeViewNameResponse extends ResponseBase
         * 
         * @param new_view_name: String
         */
        return userProfileAction.changeViewName(putParams);
    }

    @PutMapping("/changePassword")
    public ResponseBase changePassword(@RequestBody Map<String, Object> putParams) throws Exception {
        /**
         * @return ChangePasswordResponse extends ResponseBase
         * 
         * @params password: String
         *         password_check: String
         */
        return userProfileAction.changePassword(putParams);
    }

    @GetMapping("/questions")
    public ResponseBase questions(@RequestParam Map<String, Object> getParams) {
        /**
         * @return QuestionsResponse extends ResponseBase
         * 
         * @params title: String
         *         poster_id: String
         *         language: String : .区切り(言語ID | null)
         *         scoring: String : tf | t | f
         *         answered: String : tf | t | f
         *         password: String : tf | t | f
         *         sort: String : new | old
         */
        return userQuestionAction.questions(getParams);
    }
}
