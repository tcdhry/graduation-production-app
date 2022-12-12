package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.ManagerQuestionAction;
import com.krc.pgr.response.ResponseBase;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/manager")
public class ManagerController {
    @Autowired
    ManagerQuestionAction managerQuestionAction;

    @PostMapping("/titleCheck")
    public ResponseBase titleCheck(@RequestBody Map<String, Object> postParams) {
        /**
         * @return TitleCheckResponse extends ResponseBase
         * 
         * @param question_title: String
         */
        return managerQuestionAction.titleCheck(postParams);
    }

    @PostMapping("/postQuestion")
    public ResponseBase postQuestion(@RequestBody Map<String, Object> postParams) throws Exception {
        /**
         * @return PostQuestionResponse extends ResponseBase
         * 
         * @params question_title: String
         *         question_text: String
         *         input: String
         *         input_explain: String
         *         output: String
         *         output_explain: String
         *         inputs: {String, String, String}
         *         outputs: {String, String, String}
         *         io_explain: {String, String, String}
         *         language_designation: Integer (null | int)
         *         view_password: String
         *         private_answer_mode: boolean
         *         release_flag: boolean
         */
        return managerQuestionAction.postQuestion(postParams);
    }
}
