import { Fragment } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-cloud9_day";
import "ace-builds/src-noconflict/theme-cloud9_night";
import "ace-builds/src-noconflict/theme-cloud9_night_low_color";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-crimson_editor";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-dreamweaver";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-gob";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-gruvbox_dark_hard";
import "ace-builds/src-noconflict/theme-gruvbox_light_hard";
import "ace-builds/src-noconflict/theme-idle_fingers";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/theme-katzenmilch";
import "ace-builds/src-noconflict/theme-kr_theme";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-merbivore";
import "ace-builds/src-noconflict/theme-merbivore_soft";
import "ace-builds/src-noconflict/theme-mono_industrial";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-pastel_on_dark";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-sqlserver";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-tomorrow_night_blue";
import "ace-builds/src-noconflict/theme-tomorrow_night_bright";
import "ace-builds/src-noconflict/theme-tomorrow_night_eighties";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-vibrant_ink";
import "ace-builds/src-noconflict/theme-xcode";

import "ace-builds/src-noconflict/mode-java";

function Develop() {
    return (
        <div>
            {
                function () {
                    const list: Array<JSX.Element> = [];
                    [
                        "chaos",
                        "terminal",
                        "vibrant_ink",
                        
                        "ambiance",
                        "cloud9_night",
                        "cloud9_night_low_color",
                        "clouds_midnight",
                        "gruvbox",
                        "gruvbox_dark_hard",
                        "kr_theme",
                        "merbivore",
                        "merbivore_soft",
                        "mono_industrial",
                        "monokai",
                        "tomorrow_night",
                        "tomorrow_night_bright",
                        "tomorrow_night_eighties",
                        "twilight",
                        
                        "tomorrow_night_blue",
                        "pastel_on_dark",
                        "solarized_dark",
                        "nord_dark",
                        "one_dark",
                        "gob",
                        "idle_fingers",
                        "cobalt",
                        "dracula",

                        "chrome",
                        "cloud9_day",
                        "clouds",
                        "crimson_editor",
                        "dawn",
                        "dreamweaver",
                        "eclipse",
                        "github",
                        "gruvbox_light_hard",
                        "iplastic",
                        "katzenmilch",
                        "kuroir",
                        "solarized_light",
                        "sqlserver",
                        "textmate",
                        "tomorrow",
                        "xcode"
                    ].forEach((theme) => {
                        list.push(
                            <Fragment key={theme}>
                                <p>{theme}</p>
                                <AceEditor
                                    theme={theme}
                                    mode={'java'}
                                    defaultValue={`import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        System.out.println("XXXXXX");
    }
}`}
                                />
                            </Fragment>
                        );
                    });
                    return list;
                }()
            }
        </div>
    );
}

export default Develop;