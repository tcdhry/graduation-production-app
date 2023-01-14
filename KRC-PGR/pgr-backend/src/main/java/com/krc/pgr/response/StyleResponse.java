package com.krc.pgr.response;

import java.util.Map;

public class StyleResponse extends ResponseBase {
    Map<String, Object> style;

    public StyleResponse() {
    }

    public StyleResponse(Map<String, Object> style) {
        this.style = style;
    }

    public Map<String, Object> getStyle() {
        return style;
    }
}
