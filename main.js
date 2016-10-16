'use strict';
const {app, BrowserWindow, dialog} = require('electron');
var jsonFile = require('./app/js/jsonFile.js');
var ipcMain = require('electron').ipcMain;
var nurl = require('url');
let mainWindow;
const fs = require('fs');
var file_eventobj = fs.readFileSync('file.json');
let file = file_eventobj;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1100,
    })
    mainWindow.loadURL('file://' + __dirname + '/app/index.html?file=' + file);
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.on('ready', createWindow)

ipcMain.on('resize-window-mobile', function (event, arg) {
    mainWindow.setSize(300, 400)
    if (typeof file === undefined) {
        mainWindow.loadURL('file://' + __dirname + '/app/index_mobile.html')
    }
    else {
        mainWindow.loadURL('file://' + __dirname + '/app/index_mobile.html?file=' + file);
    }
})

ipcMain.on('resize-window-Desktop', function (event, arg) {
    mainWindow.setSize(1200, 1100)
    mainWindow.loadURL('file://' + __dirname + '/app/index.html?file=' + file)
})

ipcMain.on('resize-window-Tablet', function (event, arg) {
    mainWindow.setSize(800, 600)
    mainWindow.loadURL('file://' + __dirname + '/app/index.html?file=' + file)
})

ipcMain.on('open-addEvent-window', function (event, arg) {
    //console.log(typeof arg);

    mainWindow.setSize(300, 400)
    if (typeof file === undefined) {
        mainWindow.loadURL('file://' + __dirname + '/app/mobile_add_event.html?time=' + arg)
    }
    else {
        mainWindow.loadURL('file://' + __dirname + '/app/mobile_add_event.html?time=' + arg + "&file=" + file);
    }

})

ipcMain.on('back_home_page', function (event, arg) {
    //mainWindow.setSize(300, 400)
    mainWindow.loadURL('file://' + __dirname + '/app/index_mobile.html')
})

ipcMain.on('daily_view', function (event, arg) {
    if (typeof file === 'undefined') {
        mainWindow.loadURL('file://' + __dirname + '/app/daily_view.html?time=' + arg)
    } else {
        mainWindow.loadURL('file://' + __dirname + '/app/daily_view.html?time=' + arg + '&file=' + file);
    }

})

ipcMain.on('add_event', function (event, arg) {
    console.log("receive");
    mainWindow.loadURL('file://' + __dirname + '/app/mobile_add_event.html?time=' + arg + '&file=' + file);
})

ipcMain.on('back_main_page', function (event, arg) {
    mainWindow.loadURL('file://' + __dirname + '/app/index.html?file=' + file)
})


ipcMain.on('Open choose window', function (event, arg) {
    var new_file = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] })
    
    //console.log(file +" %%%%");
    if (typeof new_file === 'undefined') {
        
    }
    else {
        file = new_file;
        fs.writeFile('file.json', file);
        //console.log(file);
        var url = mainWindow.webContents.getURL();
        //console.log(url);
        var urlObj = nurl.parse(url, true);
        //console.log('file://' + urlObj.pathname + '?time=' + urlObj.query.time + '&file=' + file);
        mainWindow.loadURL(nurl.format('file://' + urlObj.pathname + '?time=' + urlObj.query.time + '&file=' + file));
    }

});

