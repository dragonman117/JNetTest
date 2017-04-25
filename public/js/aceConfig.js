/**
 * Created by timothyferrell on 3/24/17.
 */

let editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/c_cpp");
editor.setOption({ maxLines: Infinity });
editor.$blockScrolling = Infinity;
editor.resize();