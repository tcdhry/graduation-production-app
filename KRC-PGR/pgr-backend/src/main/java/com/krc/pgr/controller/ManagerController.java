package com.krc.pgr.controller;

import org.springframework.web.bind.annotation.RestController;

import com.krc.pgr.action.ManagerAnswerAction;
import com.krc.pgr.action.ManagerExamAction;
import com.krc.pgr.action.ManagerQuestionAction;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/manager")
@Permit(authority = { Authority.MANAGER, Authority.ADMIN })
public class ManagerController {
    @Autowired
    ManagerQuestionAction managerQuestionAction;

    @Autowired
    ManagerAnswerAction managerAnswerAction;

    @Autowired
    ManagerExamAction managerExamAction;

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

    @GetMapping("/viewMyQuestions")
    public ResponseBase viewMyQuestions(@RequestParam Map<String, Object> getParams) {
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
        return managerQuestionAction.myQuestions(getParams);
    }

    @GetMapping("/editQuestion/{question_id}")
    public ResponseBase editQuestion(@PathVariable String question_id) throws SQLException {
        /**
         * @return QuestionResponse extends ResponseBase
         * 
         * @param question_id: String
         */
        return managerQuestionAction.editQuestion(question_id);
    }

    @PostMapping("/editQuestion/{question_id}")
    public ResponseBase editQuestion(@PathVariable String question_id, @RequestBody Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        /**
         * @return EditQuestionResponse extends ResponseBase
         * 
         * @param question_id: String
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
         * 
         */
        return managerQuestionAction.editQuestion(question_id, postParams);
    }

    @GetMapping("/editQuestionIO/{question_id}")
    public ResponseBase editQuestionIO(@PathVariable String question_id) throws SQLException {
        /**
         * @return QuestionResponse extends ResponseBase
         * 
         * @param question_id: String
         */
        return managerQuestionAction.getQuestionIO(question_id);
    }

    @PostMapping("/editQuestionIO/{question_id}")
    public ResponseBase editQuestionIO(@PathVariable String question_id, @RequestBody Map<String, Object> postParams) {
        /**
         * @return EditQuestionResponse extends ResponseBase
         * 
         * @param question_id: String
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
         * 
         */
        return managerQuestionAction.editQuestionIO(question_id, postParams);
    }

    @GetMapping("/viewAnswers/{question_id}")
    public ResponseBase viewAnswers(@PathVariable String question_id) throws SQLException {
        /**
         * @return ViewAnswersResponse extends ResponseBase
         * 
         * @param question_id: String
         */
        return managerAnswerAction.viewAnswers(question_id);
    }

    @PostMapping("/downloadAnswers/{question_id}")
    public ResponseBase downloadAnswers(@PathVariable String question_id, @RequestBody Map<String, Object> postParams) throws IOException {
        /**
         * @return DownloadAnswersResponse extends ResponseBase
         * 
         * @param question_id: String
         * @params dl_users: List<Integer>
         */
        return managerAnswerAction.downloadAnswers(question_id, postParams);
    }

    @GetMapping("/viewAnswer/{question_id}/{user_id}")
    public ResponseBase viewAnswer(@PathVariable String question_id, @PathVariable String user_id) throws IOException, SQLException {
        /**
         * @return ViewAnswerResponse extends Response
         * 
         * @param question_id: String
         * @param user_id:     String
         */
        return managerAnswerAction.viewAnswer(question_id, user_id);
    }

    @GetMapping("/getMyAllQuestions")
    public ResponseBase getMyAllQuestions() {
        /**
         * @return GetMyAllQuestionsResponse extends ResponseBase
         */
        return managerQuestionAction.getMyAllQuestions();
    }

    @PostMapping("/postExam")
    public ResponseBase postExam(@RequestBody Map<String, Object> postParams) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        /**
         * @return PostExamResponse extends ResponseBase
         * 
         * @params postParams: @RequestBody Map<String, Object>
         *         exam_title:String
         *         description: String
         *         password: String
         *         password_check: String
         *         release_flag: boolean
         *         question_ids: List<Integer>
         *         allocate_scores: List<Integer>
         */
        return managerExamAction.postExam(postParams);
    }

    @GetMapping("/getMyExam/{exam_id}")
    public ResponseBase getMyExam(@PathVariable String exam_id) throws SQLException {
        /**
         * @return GetMyExamResponse extends ResponseBase
         */
        return managerExamAction.getMyExam(exam_id);
    }

    @PostMapping("/editExam/{exam_id}")
    public ResponseBase editExam(@RequestBody Map<String, Object> postParams, @PathVariable String exam_id) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        /**
         * @return PostExamResponse extends ResponseBase
         * 
         * @params postParams: @RequestBody Map<String, Object>
         *         exam_title:String
         *         description: String
         *         password: String
         *         password_check: String
         *         release_flag: boolean
         *         question_ids: List<Integer>
         *         allocate_scores: List<Integer>
         */
        return managerExamAction.editExam(postParams, exam_id);
    }

    @GetMapping("/getMyExams")
    public ResponseBase getMyExams() {
        return managerExamAction.getMyExams();
    }

    @GetMapping("/scoringExam/{exam_id}")
    public ResponseBase scoringExam(@PathVariable String exam_id) throws SQLException {
        return managerExamAction.scoringExam(exam_id);
    }

    @PostMapping("/downloadExamAnswers/{exam_id}")
    public ResponseBase downloadExamAnswers(@PathVariable String exam_id, @RequestBody Map<String, Object> postParams) {
        return managerExamAction.downloadExamAnswers(exam_id, postParams);
    }
}
