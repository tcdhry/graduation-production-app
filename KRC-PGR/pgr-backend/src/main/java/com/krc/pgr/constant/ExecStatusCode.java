package com.krc.pgr.constant;

public enum ExecStatusCode {
    ACCEPTED(0), COMPILATION_ERROR(1), MemoryLimitExceeded(2), TIME_LIMIT_EXCEEDED(3), RUNTIME_ERROR(4), OutputLimitExceeded(5), InternalError(6), WRONG_ANSWER(7);

    private int id;

    ExecStatusCode(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }
}
