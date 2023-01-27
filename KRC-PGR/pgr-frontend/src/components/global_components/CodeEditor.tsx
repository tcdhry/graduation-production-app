import AceEditor from "react-ace";

/**
 * Unable to infer path to ace from script src, use ace.config.set('basePath', 'path') to enable dynamic loading of modes and themes or with webpack use ace/webpack-resolver
 * 開発者ツールにて上記エラーが表示されるため直下のインポートの追加。無くても全く問題なく動く。
 */
import "ace-builds/webpack-resolver";

/**
 * 言語一覧
 */
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-ruby";

/**
 * テーマ一覧
 */
import "ace-builds/src-noconflict/theme-terminal";

import { LanguageCode } from "../../constants/Language";
import { useEffect } from "react";

const mode = {
    [LanguageCode.Java]: 'java',
    [LanguageCode.CPlusPlus]: 'c_cpp',
    [LanguageCode.CSharp]: 'csharp',
    [LanguageCode.Python]: 'python',
    [LanguageCode.Ruby]: 'ruby',
};

const defaultValue = {
    [LanguageCode.Java]: `import java.util.*;

// Mainクラスの名前は変更しないでください。
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

// Programクラスの名前は変更しないでください。
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

function CodeEditor(props: { language: LanguageCode | null, editorRef?: undefined | React.RefObject<AceEditor>, defaultValue?: string }) {
    useEffect(() => {
        props.editorRef?.current?.editor.setValue(defaultValue[props.language!]);
        // valueを書き換えると値が全選択された状態になるため、カーソル位置を移動する処理を追加する。
        props.editorRef?.current?.editor.getSelection().moveCursorTo(0, 0);
    }, [props.language, props.editorRef]);

    return (
        <>
            <AceEditor
                mode={props.language === null ? 'text' : mode[props.language]}
                theme="terminal"
                fontSize={14}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                setOptions={{
                    showLineNumbers: true,
                    tabSize: 4,
                }}
                width="100%"
                height="80vh"
                ref={props.editorRef}
                defaultValue={props.defaultValue}
            />
        </>
    );
}

export default CodeEditor;