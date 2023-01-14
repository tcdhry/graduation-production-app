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

    public RuntimeManage getRuntimeInstance(Language language, int question_id, String sourceCode, boolean execConfirm) throws IOException {
        switch (language) {
        case CPlusPlus:
            return new CPlusPlusRuntime(question_id, session.getLoginUser().getUser_id(), sourceCode, execConfirm);
        case CSharp:
            return new CSharpRuntime(question_id, session.getLoginUser().getUser_id(), sourceCode, execConfirm);
        case Java:
            return new JavaRuntime(question_id, session.getLoginUser().getUser_id(), sourceCode, execConfirm);
        case Python:
            return new PythonRuntime(question_id, session.getLoginUser().getUser_id(), sourceCode, execConfirm);
        case Ruby:
            return new RubyRuntime(question_id, session.getLoginUser().getUser_id(), sourceCode, execConfirm);
        default:
            throw new IllegalArgumentException();
        }
    }
}
