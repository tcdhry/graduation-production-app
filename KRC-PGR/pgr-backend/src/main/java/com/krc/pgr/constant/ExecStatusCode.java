package com.krc.pgr.constant;

public enum ExecStatusCode {
    Accepted(0), CompilationError(1), MemoryLimitExceeded(2), TimeLimitExceeded(3), RuntimeError(4), OutputLimitExceeded(5), InternalError(6), WrongAnswer(7);

    private int id;

    ExecStatusCode(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }
}
