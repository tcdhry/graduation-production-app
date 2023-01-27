package com.krc.pgr.constant;

public enum SourceFileName {
    Java("Main.java"), CPlusPlus("Program.cpp"), CSharp("Main.cs"), Python("Main.py"), Ruby("Main.rb");

    private String fileName;

    SourceFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileName() {
        return fileName;
    }

    public static SourceFileName search(Language language) throws IllegalArgumentException {
        switch (language) {
        case Java:
            return SourceFileName.Java;
        case CPlusPlus:
            return SourceFileName.CPlusPlus;
        case CSharp:
            return SourceFileName.CSharp;
        case Python:
            return SourceFileName.Python;
        case Ruby:
            return SourceFileName.Ruby;
        }
        throw new IllegalArgumentException();
    }
}
