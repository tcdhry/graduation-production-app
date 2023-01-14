package com.krc.pgr.response;

public class QuestionIOResponse extends ResponseBase {
    private String[] input_judge;
    private String[] output_judge;

    public QuestionIOResponse() {
    }

    public QuestionIOResponse(String[] input_judge, String[] output_judge) {
        this.input_judge = input_judge;
        this.output_judge = output_judge;
    }

    public String[] getInput_judge() {
        return input_judge;
    }

    public String[] getOutput_judge() {
        return output_judge;
    }
}
