import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-ruby";

// import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import { LanguageCode } from "../../constants/Language";

const mode = {
    [LanguageCode.Java]: 'java',
    [LanguageCode.CPlusPlus]: 'c_cpp',
    [LanguageCode.CSharp]: 'csharp',
    [LanguageCode.Python]: 'python',
    [LanguageCode.Ruby]: 'ruby',
};

const defaultValue = {
    [LanguageCode.Java]: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        System.out.println("XXXXXX");
    }
}`,
    [LanguageCode.CPlusPlus]: `#include <iostream>
using namespace std;

int main(void){
    string str;
    getline(cin, str);
    cout << "XXXXXX" << endl;
    return 0;
}`,
    [LanguageCode.CSharp]: `using System;

class Program
{
    static void Main()
    {
        var line = Console.ReadLine();
        Console.WriteLine("XXXXXX");
    }
}`,
    [LanguageCode.Python]: `input_line = input()
print("XXXXXX")`,
    [LanguageCode.Ruby]: `input_line = gets
puts "XXXXXX"`,
}


function CodeEditor(props: { language: LanguageCode | null, editorRef?: undefined | React.LegacyRef<AceEditor> }) {
    if (props.language == null) {
        return (
            <div>
                <AceEditor
                    placeholder="choose language"
                    theme="pastel_on_dark"
                    width="100%"
                    height="80vh"
                    fontSize={14}
                    ref={props.editorRef}
                />
            </div>
        );
    }

    return (
        <>
            <AceEditor
                placeholder="Edit code here;"
                mode={mode[props.language]}
                theme="pastel_on_dark"
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={defaultValue[props.language]}
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 4,
                }}
                width="100%"
                height="80vh"
                ref={props.editorRef}
            />
        </>
    );
}

export default CodeEditor;