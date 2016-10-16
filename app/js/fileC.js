'use strict';
var ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');

window.onload = function () {
    //alert("file_window run ");
    var read_btn = document.getElementById("read_btn");
    var close_btn = document.getElementById("close_btn");
    close_btn.onclick = function () {
        ipcRenderer.send('close_file_window');
    }
}
