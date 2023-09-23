var objShell = new ActiveXObject("Shell.Application");
objShell.ShellExecute("cmd.exe", "C: say test", "C:\\WINDOWS\\system32", "open", "1");