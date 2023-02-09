package com.krc.pgr.response;

import java.util.List;
import java.util.Map;

public class GetClassesCompositionResponse extends ResponseBase {
    List<Map<String, Object>> classes;

    public GetClassesCompositionResponse(List<Map<String, Object>> classes) {
        this.classes = classes;
    }

    public List<Map<String, Object>> getClasses() {
        return classes;
    }
}
