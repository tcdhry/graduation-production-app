package com.krc.pgr.response;

import java.util.List;

import com.krc.pgr.bean.ClassBean;

public class GetClassesResponse extends ResponseBase {
    private List<ClassBean> classes;

    public GetClassesResponse(List<ClassBean> classes) {
        this.classes = classes;
    }

    public List<ClassBean> getClasses() {
        return classes;
    }
}
