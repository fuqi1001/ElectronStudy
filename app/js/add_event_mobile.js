'use strict';
var ipcRenderer = require('electron').ipcRenderer;
//console.log(require.resolve('../app/js/jsonFile.js'));
var jsonFile = require('../app/js/jsonFile.js');
//console.log(jsonFile);
const fs = require('fs');
var nurl = require('url');

//console.log(fs.readFileSync('.'));
//const jsonFile = require("app/js/jsonFile.js");

window.onload = function () {


    //jsonFile.jsonFileMod.ww();

    // var url = window.location.href;
    // var vars = url.split("?");
    // var temp_time = vars[1].split("=");
    // //var times = temp_time[1];
    // var temp_f = temp_time[1].split("&");
    // var times = temp_f[0];
    // var file = temp_f[1];
    // console.log(file);
    var url_temp = nurl.parse(window.location.href, true);
    var queryParam = url_temp.query;
    var times = queryParam.time;
    var file = queryParam.file;

    console.log(file);

    var dateObj = new Date(parseInt(times));

    //console.log(dateObj);

    var obody = document.body;
    createbox();
    function createbox() {

        var ddbox = document.createElement("div");
        ddbox.id = "box_add_event_mobile";
        ddbox.style.display = "none";
        var str = '<div id="display_date_addEvent"></div>';
        str += '<p style=" margin-left: 5%;color:#fff;font-size:100%">Title</p>'
        str += '<input type="text" id="event_input_1" class="event_input"></input>'

        str += '<p style=" margin-left: 5%;color:#fff;font-size:100%">Location</p>'
        str += '<input type="text" id="event_input_2" class="event_input"></input>'

        str += '<p style=" margin-left: 5%;color:#fff;font-size:100%">Description</p>'
        str += '<textarea id="event_input_Description" ></textarea>'

        str += '<div id="error_display"></div>'
        str += '<div id="btn_mobile"><div id="add_btn">Add</div><div id="back_home">Home</div></div>'

        // str += 
        ddbox.innerHTML = str;
        obody.appendChild(ddbox);
    };
    //==================== create ele ========================
    var box = document.getElementById("box_add_event_mobile");
    var display_date_addEvent = document.getElementById("display_date_addEvent");
    var error_display = document.getElementById("error_display");
    var add_btn = document.getElementById("add_btn");


    box.style.display = "block";
    init(dateObj);
    //==================== Event save =========================



    add_btn.onclick = function () {

        var event_filter = new Array();
        //event_filter[0] = "ID";
        event_filter[0] = "date_event";
        event_filter[1] = "title";
        event_filter[2] = "location";
        event_filter[3] = "Description";

        var Unique_event = new Object();
        var dateArray = new Array();

        var date_event = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
        //console.log(date_event);
        var title = document.getElementById('event_input_1').value;
        //console.log(title);
        if(title ===""){
            alert("Please input a valid title");
            return;
        }
        Unique_event.title = title;

        var location = document.getElementById('event_input_2').value;
        //console.log(location);
        Unique_event.location = location;

        var Description = document.getElementById('event_input_Description').value;
        //console.log(desc);
        Unique_event.Description = Description;
        
        dateArray.push(Unique_event);



        //Unique_event.title = "ddd";
        //dateArray.push(Unique_event);
        console.log("file:" + file);
        var tempp = fs.readFileSync(file);
        // console.log(JSON.stringify(JSON.parse(tempp)));
        //console.log(tempp);
        if (tempp.length == 0) {

            //var jsonFile = {};
            var t = {};
            t[date_event] = dateArray;
            console.log(typeof t);
            var events = new Object(t);
            console.log(events);
            jsonFile.jsonFileMod.writeJSON(file, t);
            alert("Add event success");
        }
        else {
            var t = JSON.parse(tempp);
            //console.log(t[date_event]);
            if (typeof t[date_event] === 'undefined') {
                t[date_event] = dateArray;
            } else {
                t[date_event].push(Unique_event);
            }
            //console.log(t[date_event]);
            var events = new Object(t);
            //events[date_event] = dateArray;
            //console.log(JSON.stringify(events));

            var jsonText = JSON.stringify(Unique_event, event_filter, "\t");
            var jsonArray = new Array();

            //console.log(jsonText);
            jsonFile.jsonFileMod.writeJSON(file, events);
            alert("Add event success");
        }
    }

    back_home.onclick = function () {
        //ipcRenderer.send('back_home_page', "ping");
        history.go(-1);
    }
    //======================== show error =====================

    function error_dis(error) {
        if (error !== undefined) {
            var err = document.createElement("div");
            err.className = "err";
            var err_mes = "Error! " + error;
            err.innerHTML = err_mes;
            error_display.appendChild(err);
        } else return;

    }
    //error_dis("Something Error!");
    //======================== display_date ===================
    function init(dateObj) {
        //console.log(dateObj.getDay());
        var full_str = toMonth(dateObj) + " / " + dateObj.getDate() + " / " + dateObj.getFullYear() + "         " + today(dateObj);
        display_date_addEvent.innerHTML = full_str;
    }
    function alldays(dateObj) {
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth();
        if (isLeapYear(year)) {
            switch (month) {
                case 0: return "31";
                case 1: return "29";
                case 2: return "31";
                case 3: return "30";
                case 4: return "31";
                case 5: return "30";
                case 6: return "31";
                case 7: return "31";
                case 8: return "30";
                case 9: return "31";
                case 10: return "30";
                case 11: return "31";
                default:
            };
        } else {
            switch (month) {
                case 0: return "31";
                case 1: return "28";
                case 2: return "31";
                case 3: return "30";
                case 4: return "31";
                case 5: return "30";
                case 6: return "31";
                case 7: return "31";
                case 8: return "30";
                case 9: return "31";
                case 10: return "30";
                case 11: return "31";
                default:
            };
        };
    };
    function isLeapYear(year) {
        if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            return true;
        } else {
            return false;
        };
    };
    function toMonth(dateObj) {
        var month = dateObj.getMonth();
        switch (month) {
            case 0: return "Jan.";
            case 1: return "Feb.";
            case 2: return "Mar.";
            case 3: return "Apr.";
            case 4: return "May";
            case 5: return "Jun.";
            case 6: return "Jul.";
            case 7: return "Aug.";
            case 8: return "Sept.";
            case 9: return "Oct.";
            case 10: return "Nov.";
            case 11: return "Dec.";
            default:
        };
    };

    function today(dateObj) {
        var day = dateObj.getDay();
        switch (day) {
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            case 0: return "Sunday";

        }
    }
}