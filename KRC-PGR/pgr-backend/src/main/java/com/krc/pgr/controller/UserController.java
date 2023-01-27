package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.UserProfileAction;
import com.krc.pgr.action.UserStyleAction;
import com.krc.pgr.action.UserViewAnswerAction;
import com.krc.pgr.action.UserExecQuestionAction;
import com.krc.pgr.action.UserGetQuestionAction;
import com.krc.pgr.aspect.Permit;
import com.krc.pgr.constant.Authority;
import com.krc.pgr.response.ResponseBase;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    UserGetQuestionAction userGetQuestionAction;

    @Autowired
    UserExecQuestionAction userExecQuestionAction;

    @Autowired
    UserViewAnswerAction userViewAnswerAction;

    @Autowired
    UserStyleAction userStyleAction;

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
        return userGetQuestionAction.questions(getParams);
    }

    @GetMapping("/question/{question_id}")
    public ResponseBase qeustion(@PathVariable String question_id) throws SQLException {
        /**
         * @return QuestionResponse extends ResponseBase
         * 
         * @params @PathVariable question_id: String
         */
        return userGetQuestionAction.question(question_id);
    }

    @PostMapping("/questionWithPassword/{question_id}")
    public ResponseBase questionWithPassword(@PathVariable String question_id, @RequestBody Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException, SQLException {
        /**
         * @return QuestionResponse extends ResponseBase
         * 
         * @param @PathVariable question_id: String
         * @param @RequestBody  postParams: Map<String, Object>
         *                      ."view_password": String
         */
        return userGetQuestionAction.questionWithPassword(question_id, postParams);
    }

    @PostMapping("/execConfirm/{question_id}")
    public ResponseBase execConfirm(@PathVariable String question_id, @RequestBody Map<String, Object> postParams) throws SQLException, IOException {
        /**
         * @return ExecConfirmResponse extends ResponseBase
         * 
         * @param @PathVariable question_id: String
         * @param @RequestBody  postParams: Map<String, Object>
         *                      ."source_code": String
         *                      ."select_language": Integer
         */
        return userExecQuestionAction.execConfirm(question_id, postParams);
    }

    @PostMapping("/answerConfirm/{question_id}")
    public ResponseBase answerConfirm(@PathVariable String question_id, @RequestBody Map<String, Object> postParams) throws SQLException, IOException {
        return userExecQuestionAction.answerConfirm(question_id, postParams);
    }

    @GetMapping("/viewAnswer/{question_id}")
    public ResponseBase viewAnswer(@PathVariable String question_id) throws IllegalArgumentException, IOException {
        return userViewAnswerAction.viewAnswer(question_id);
    }

    @GetMapping("/getStyles")
    public ResponseBase getStyles() {
        return userStyleAction.getStyles();
    }
}
