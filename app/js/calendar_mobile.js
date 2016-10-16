'use strict';
var ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
var nurl = require('url');
window.onload = function () {
    var dateObj = new Date();
    // var url = window.location.href;
    // var vars = url.split("?");
    // var temp_time = vars[1].split("=");
    // //var times = temp_time[1];
    // var file = temp_time[1]
    // console.log(file);

    var url_temp = nurl.parse(window.location.href, true);
    var queryParam = url_temp.query;
    var times = queryParam.time;
    var file = queryParam.file;
    console.log(queryParam.file + " ===========");



    var obody = document.body;
    createbox();
    function createbox() {

        var ddbox = document.createElement("div");
        ddbox.id = "box_mobile";
        ddbox.style.display = "none";
        var str = "";
        str += '<div id="event_mobile" ></div>'
        str += '<div id="add_event_btns" style="text-align:center;"><p style="color: #F98909">Add Event</p></div>'
        str += '<div id="mobile_date_dis"><div id="prevmonth_mobile"><<</div><div id="prevday"><</div><div id="display_date"></div><div id="nextday">></div><div id="nextmonth_mobile">>></div></div>'
        ddbox.innerHTML = str;
        obody.appendChild(ddbox);
    };

    var box = document.getElementById("box_mobile");
    //var date = document.getElementById("date");
    var event_mobile = document.getElementById("event_mobile");
    var add_event_btns = document.getElementById("add_event_btns");
    var prevmonth_mobile = document.getElementById("prevmonth_mobile");
    var prevday = document.getElementById("prevday");
    var display_date = document.getElementById("display_date");
    var nextday = document.getElementById("nextday");
    var nextmonth_mobile = document.getElementById("nextmonth_mobile");

    //===================display event====================================
    function init_event() {

        var event_file = fs.readFileSync(file);
        //console.log(event_file.length == 0);
        if (event_file.length == 0) {
            for (var i = 0; i < 2; i++) {
                var str = "No event" + "<br>" + "Have a nice day!"
                var event = document.createElement("div");
                event.className = "event";
                event.innerHTML = str;
                event_mobile.appendChild(event);
            }
        } else {
            event_file = JSON.parse(event_file);
            //console.log(event_file);
            function length(obj) {
                return Object.keys(obj).length;
            }
            //console.log();
            //var total = length(event_file);
            //console.log("M1: " + (dateObj.getMonth() + 1));
            var tempdate = new Date();
            //console.log("M1: " + (tempdate.getMonth() + 1));
            var total = Object.keys(event_file).length;
            //console.log(total);

            /*function display_event(total) {
                for (var i = 0; i < total; i++) {

                    //console.log(Object.keys(event_file)[i]);
                    //console.log(JSON.stringify(event_file[Object.keys(event_file)[i]])) ;
                    var temp_len = event_file[Object.keys(event_file)[i]].length;
                    //console.log(temp_len);
                    var str = new String;
                    for (var j = 0; j < temp_len; j++) {
                        var title = event_file[Object.keys(event_file)[i]][j].title;
                        var loca = event_file[Object.keys(event_file)[i]][j].location;
                        var desc = event_file[Object.keys(event_file)[i]][j].Description;
                        str = '<br>' + "title: " + title + "<br>" + " Location: " + loca + "<br>" + "Description: " + desc + "<br>";
                        var event = document.createElement("div");
                        event.className = "event";
                        event.innerHTML = Object.keys(event_file)[i] + "<br>" + str;
                        event_mobile.appendChild(event);
                    }
                }
                
            }*/
            var list = document.getElementById("event_mobile");
            //console.log(list.childNodes.length);
            var len = list.childNodes.length;
            for (var i = 0; i < len; i++) {
                //console.log("remove");
                list.removeChild(list.childNodes[0]);
                //console.log(list.childNodes.length);
            }

            var fileObj = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + (dateObj.getDate());
            //console.log(fileObj);
            //console.log(event_file[fileObj]);

            if (typeof event_file[fileObj] !== 'undefined') {
                var temp_len = event_file[fileObj].length;
                //console.log(temp_len);
                for (var j = 0; j < temp_len; j++) {
                    var title = event_file[fileObj][j].title;
                    var loca = event_file[fileObj][j].location;
                    var desc = event_file[fileObj][j].Description;
                    str = '<br>' + "title: " + title + "<br>" + " Location: " + loca + "<br>" + "Description: " + desc + "<br>";
                    var event = document.createElement("div");
                    event.className = "event";
                    event.innerHTML = fileObj + "<br>" + str;
                    event_mobile.appendChild(event);
                }
            } else {
                var event = document.createElement("div");
                event.className = "event";
                event.innerHTML = "No event"+"<br>"+"Have a nice day!" 
                event_mobile.appendChild(event);
            }


            //display_event(total);
        }
    }


    box.style.display = "block";

    //===================add event====================================

    add_event_btns.onclick = function () {
        console.log("run");
        ipcRenderer.send('open-addEvent-window', dateObj.getTime());
    }

    //===================set year month===============================


    //dateObj.setDate(1);
    init(dateObj);
    var days = new Array();
    days[0] = 31;
    days[1] = 28;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;


    prevmonth_mobile.onclick = function () {
        var ddm = null;
        var ddy = null;
        var flag = false;

        if ((dateObj.getMonth() - 1) == -1) {
            ddm = 11;
            ddy = dateObj.getFullYear() - 1;
        } else {
            ddm = dateObj.getMonth() - 1;
            ddy = dateObj.getFullYear();
        };

        if (dateObj.getDate() == alldays(dateObj)) {
            var last_day = days[ddm];
            console.log(last_day);
            if (isLeapYear(dateObj.getFullYear()) && ddm == 1) {
                console.log("run");
                last_day += 1;
            }
            dateObj.setMonth(ddm, last_day);
            console.log(dateObj);
        }
        else {
            dateObj.setMonth(ddm);
        }


        dateObj.setFullYear(ddy);
        init(dateObj);
    }
    prevday.onclick = function () {
        if (dateObj.getDate() == 1) {
            var ddm = null;
            var ddy = null;
            if ((dateObj.getMonth() - 1) == -1) {
                ddm = 11;
                ddy = dateObj.getFullYear() - 1;
            } else {
                ddm = dateObj.getMonth() - 1;
                ddy = dateObj.getFullYear();
            };
            dateObj.setFullYear(ddy);
            dateObj.setMonth(ddm);
            var temp = alldays(dateObj);
            dateObj.setDate(temp);
        } else {
            var new_date = dateObj.getDate() - 1;
            dateObj.setDate(new_date);
        }
        init(dateObj);
    }

    nextmonth_mobile.onclick = function () {
        var ddm = null;
        var ddy = null;
        if ((dateObj.getMonth() + 1) == 12) {
            ddm = 0;
            ddy = dateObj.getFullYear() + 1;
        } else {
            ddm = dateObj.getMonth() + 1;
            ddy = dateObj.getFullYear();
        };

        if (dateObj.getDate() == alldays(dateObj)) {
            var last_day = days[ddm];
            console.log(last_day);
            if (isLeapYear(dateObj.getFullYear()) && ddm == 1) {
                console.log("run");
                last_day += 1;
            }
            dateObj.setMonth(ddm, last_day);
            //console.log(dateObj);
        }
        else {
            dateObj.setMonth(ddm);
        }
        dateObj.setFullYear(ddy);

        init(dateObj);
    }

    nextday.onclick = function () {
        if (dateObj.getDate() == alldays(dateObj)) {
            var ddm = null;
            var ddy = null;
            if ((dateObj.getMonth() + 1) == 12) {
                ddm = 0;
                ddy = dateObj.getFullYear() + 1;
            } else {
                ddm = dateObj.getMonth() + 1;
                ddy = dateObj.getFullYear();
            };

            dateObj.setFullYear(ddy);
            dateObj.setMonth(ddm, 1);

        } else {
            var new_date = dateObj.getDate() + 1;
            dateObj.setDate(new_date);
        }
        init(dateObj);
    }








    //===================set day===============================


    var oneweek = oneyearoneday(dateObj);

    var alld = alldays(dateObj);

    var nowd = nowday(dateObj);

    //init(oneweek, alld, nowd);

    //===================function===============================

    function hasclass(str, cla) {
        var i = str.search(cla);
        if (i == -1) {
            return false;
        } else {
            return true;
        };
    };

    function init(dateObj) {
        //console.log(dateObj.getDay());
        var full_str = toMonth(dateObj) + " / " + dateObj.getDate() + " / " + dateObj.getFullYear() + "         " + today(dateObj);
        display_date.innerHTML = full_str;
        init_event();
    }


    function oneyearoneday(dateObj) {
        var oneyear = new Date();
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth();
        oneyear.setFullYear(year);
        oneyear.setMonth(month);
        oneyear.setDate(1);
        return oneyear.getDay();
    };

    function nowday(dateObj) {
        return dateObj.getDate();
    };

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