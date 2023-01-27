package com.krc.pgr.constant;

import com.krc.pgr.runtime.RuntimeManage;
import com.krc.pgr.util.SessionManage;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.krc.pgr.runtime.CPlusPlusRuntime;
import com.krc.pgr.runtime.CSharpRuntime;
import com.krc.pgr.runtime.JavaRuntime;
import com.krc.pgr.runtime.PythonRuntime;
import com.krc.pgr.runtime.RubyRuntime;

@Component
public class LanguageRuntimeMap {
    @Autowired
    SessionManage session;

    public RuntimeManage getExecConfirmRuntimeInstance(Language language, int question_id, String sourceCode) throws IOException {
        switch (language) {
        case CPlusPlus:
            return CPlusPlusRuntime.execConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case CSharp:
            return CSharpRuntime.execConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case Java:
            return JavaRuntime.execConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case Python:
            return PythonRuntime.execConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case Ruby:
            return RubyRuntime.execConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        default:
            throw new IllegalArgumentException();
        }
    }

    public RuntimeManage getAnswerConfirmRuntimeInstance(Language language, int question_id, String sourceCode) throws IOException {
        switch (language) {
        case CPlusPlus:
            return CPlusPlusRuntime.answerConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case CSharp:
            return CSharpRuntime.answerConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case Java:
            return JavaRuntime.answerConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case Python:
            return PythonRuntime.answerConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        case Ruby:
            return RubyRuntime.answerConfirm(question_id, session.getLoginUser().getUser_id(), sourceCode);
        default:
            throw new IllegalArgumentException();
        }
    }
}
