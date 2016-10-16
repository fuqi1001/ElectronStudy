'use strict';

const remote = require('electron').remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
var ipcRenderer = require('electron').ipcRenderer;

var menu = new Menu();
menu.append(new MenuItem({
    label: 'Desktop size',
    //type: 'checkbox',
    click: function () {
        ipcRenderer.send('resize-window-Desktop', 'ping');
    },
    //checked: true
}));

menu.append(new MenuItem({
    type: 'separator'
}));

menu.append(new MenuItem({
    label: 'Mobile size',
    click: function () {
        ipcRenderer.send('resize-window-mobile', 'ping');
    },
}));

menu.append(new MenuItem({
    type: 'separator'
}));


menu.append(new MenuItem({
    label: 'Tablet size',
    click: function () {
        ipcRenderer.send('resize-window-Tablet', 'ping');
    },
}));

menu.append(new MenuItem({
    type: 'separator'
}));

menu.append(new MenuItem({
    label: 'File Choose',
    click: function () {
        ipcRenderer.send('Open choose window', 'ping');
    },
}));

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);