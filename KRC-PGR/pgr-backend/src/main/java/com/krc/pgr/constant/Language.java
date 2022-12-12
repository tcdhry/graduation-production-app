package com.krc.pgr.constant;

public enum Language {
    Java(1), CPlusPlus(4), CSharp(3), Python(2), Ruby(5);

    private int id;

    Language(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }

    public static Language valueOf(int language) throws IllegalArgumentException {
        Language[] values = Language.values();
        for (Language l : values) {
            if (l.id == language) {
                return l;
            }
        }
        throw new IllegalArgumentException();
    }
}
