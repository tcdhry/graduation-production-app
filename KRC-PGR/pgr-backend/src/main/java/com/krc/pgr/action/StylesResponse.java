package com.krc.pgr.action;

import java.util.List;
import java.util.Map;

import com.krc.pgr.response.ResponseBase;

public class StylesResponse extends ResponseBase {
    List<Map<String, Object>> styles;

    public StylesResponse(List<Map<String, Object>> styles) {
        this.styles = styles;
    }

    public List<Map<String, Object>> getStyles() {
        return styles;
    }
}
