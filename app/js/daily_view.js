'use strict';
var ipcRenderer = require('electron').ipcRenderer;
var jsonFile = require('../app/js/jsonFile.js');
const fs = require('fs');
var nurl = require('url');

window.onload = function () {
    // var url = window.location.href;
    // var vars = url.split("?");
    // var temp_time = vars[1].split("=");
    // var temp_f = temp_time[1].split("&");
    // var times = temp_f[0];
    // var file = temp_f[1];
    // console.log(file);
    var url_temp = nurl.parse(window.location.href, true);
    var queryParam = url_temp.query;
    var times = queryParam.time;
    var file = queryParam.file;
    //console.log(queryParam.file + " ===========");



    var todayObj = new Date();
    var dateObj = new Date(parseInt(times));
    var motiv_dateObj = new Date(dateObj);
    /*motiv_dateObj.setDate(7);
    console.log(motiv_dateObj);
    console.log(dateObj);*/

    //console.log(dateObj);

    var obody = document.body;
    createbox();
    function createbox() {

        var ddbox = document.createElement("div");
        ddbox.id = "daily_box";
        ddbox.style.display = "block";
        var str = "";
        str += '<div id= "title_daily_view"></div>';
        str += '<div id= "today_detail"></div>';
        str += '<div id= "change_day"><div id="left_btn" class="btns_c">◀</div><div id="day_zone" class="day_zone"></div><div id="right_btn" class="btns_c">▶</div></div>';
        ddbox.innerHTML = str;
        obody.appendChild(ddbox);
    };
    //==================creat element========================
    var box = document.getElementById("daily_box");
    var title_daily_view = document.getElementById("title_daily_view");
    var today_detail = document.getElementById("today_detail");
    var change_day = document.getElementById("change_day");
    var left_btn = document.getElementById("left_btn");
    var day_zone = document.getElementById("day_zone");
    var right_btn = document.getElementById("right_btn");

    //box.style.display = block;
    //==================show title===========================

    function showtitle() {
        //console.log("run");
        //console.log(dateObj);
        var show_Date = document.createElement("div");
        show_Date.className = "show_Date";
        var temp_str = "Events For " + today(dateObj) + '<br>' + toMonth(dateObj) + " " + dateObj.getDate();
        //console.log(temp_str);
        show_Date.innerHTML = temp_str;
        //console.log(show_Date);
        title_daily_view.appendChild(show_Date);
        //console.log(title_daily_view);

        var btns = document.createElement("div");
        var btns_d = document.createElement("div");

        btns.id = "btnss";
        var btns_str = "Add new Event";
        btns_d.innerHTML = btns_str;
        btns.appendChild(btns_d);
        title_daily_view.appendChild(btns);


        var btns_back = document.createElement("div");
        var btns_d_back = document.createElement("div");

        btns_back.id = "btnss_back";
        var btns_str_back = "Back";
        btns_d_back.innerHTML = btns_str_back;
        btns_back.appendChild(btns_d_back);
        title_daily_view.appendChild(btns_back);
    }
    /*showtitle();*/
    //================show event==============================

    function showEvent() {
        var event_file = fs.readFileSync(file);
        // console.log(event_file.length == 0);
        if (event_file.length == 0) {

            var temp_str = "No event" + "<br>" + "Have a nice day!"
            var event = document.createElement("div");
            event.className = "show_Event";
            event.innerHTML = temp_str;
            title_daily_view.appendChild(event);

        } else {
            event_file = JSON.parse(event_file);
            //console.log(event_file);
            function length(obj) {
                return Object.keys(obj).length;
            }
            //console.log();
            //var total = length(event_file);
            var total = Object.keys(event_file).length;
            //console.log(total);
            function display_event(total) {

                for (var i = 0; i < total; i++) {
                    var today_temp = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + dateObj.getDate();
                    if (today_temp == Object.keys(event_file)[i]) {
                        //console.log(Object.keys(event_file)[i]);
                        //console.log(JSON.stringify(event_file[Object.keys(event_file)[i]])) ;
                        var temp_len = event_file[Object.keys(event_file)[i]].length;
                        //console.log(temp_len);
                        var temp_str = new String;
                        for (var j = 0; j < temp_len; j++) {
                            var title = event_file[Object.keys(event_file)[i]][j].title;
                            var loca = event_file[Object.keys(event_file)[i]][j].location;
                            var desc = event_file[Object.keys(event_file)[i]][j].Description;
                            temp_str = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Title: " + title + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Location: " + loca + "<br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description: " + desc;
                            var event = document.createElement("div");
                            event.className = "show_Event";
                            event.innerHTML = "<br>" + temp_str;
                            title_daily_view.appendChild(event);
                        }
                    }

                }
            }
            display_event(total);
        }
    }
    /*showEvent();*/
    //==================detail day============================
    function show_Detail() {
        var date_firstDay = new Date(dateObj);
        date_firstDay.setMonth(0);
        date_firstDay.setDate(1);

        var thisDay = Math.ceil(parseFloat((dateObj.getTime() - date_firstDay.getTime()) / 86400000)) + 1;
        //console.log(parseInt(dateObj.getTime()/86400000));
        //console.log(parseInt(date_firstDay.getTime()/86400000));
        //console.log(thisDay);
        var haveDay = 0;
        if (isLeapYear(dateObj.getFullYear())) {
            haveDay = 366 - thisDay;
        } else {
            haveDay = 365 - thisDay;
        }
        //console.log(haveDay);

        var printStr = "This is the " + thisDay + " day of the year.<br><br>There are " + haveDay + " days left in " + dateObj.getFullYear();
        today_detail.innerHTML = printStr;
    }
    /*show_Detail();*/

    //==================change day ===========================
    function init(dateObj) {
        //console.log(dateObj);
        var temp_obj = new Date(motiv_dateObj);
        var temp_days = temp_obj.getDate();

        if (temp_days <= 1) {

            var ddm = null;
            var ddy = null;
            if ((temp_obj.getMonth() - 1) == -1) {
                ddm = 11;
                ddy = temp_obj.getFullYear() - 1;
            } else {
                ddm = temp_obj.getMonth() - 1;
                ddy = temp_obj.getFullYear();
            };
            temp_obj.setFullYear(ddy);
            temp_obj.setMonth(ddm);
            var temp = alldays(temp_obj);
            if (temp_days == 1) {
                temp_obj.setDate(temp - 2);
            } else {
                temp_obj.setDate(temp);
            }
        } else {

            var new_date = temp_obj.getDate() - 3;
            temp_obj.setDate(new_date);
        }


        var list = document.getElementsByClassName("day");
        for (var i = list.length - 1; 0 <= i; i--)
            if (list[i] && list[i].parentElement)
                list[i].parentElement.removeChild(list[i]);

        for (var i = 0; i < 5; i++) {
            var each_day = document.createElement("div");
            each_day.className = "day";

            if (temp_obj.getDate() == alldays(temp_obj)) {
                var ddm = null;
                var ddy = null;
                if ((temp_obj.getMonth() + 1) == 12) {
                    ddm = 0;
                    ddy = temp_obj.getFullYear() + 1;
                } else {
                    ddm = temp_obj.getMonth() + 1;
                    ddy = temp_obj.getFullYear();
                };

                temp_obj.setFullYear(ddy);
                temp_obj.setMonth(ddm, 1);

            } else {
                var new_date = temp_obj.getDate() + 1;
                temp_obj.setDate(new_date);
            }


            if (temp_obj.getDate() == todayObj.getDate()) {
                each_day.innerHTML = temp_obj.getFullYear() + "/" + (temp_obj.getMonth() + 1) + "/" + temp_obj.getDate() + "<br>&nbsp&nbsp&nbsp&nbspToday";
            }
            else {
                each_day.innerHTML = temp_obj.getFullYear() + "/" + (temp_obj.getMonth() + 1) + "/" + temp_obj.getDate()
            }

            /*if (i == 2) {
                each_day.className = "today";
            }*/
            day_zone.appendChild(each_day);
        }
    }
    /*init(dateObj);*/

    left_btn.onclick = function () {

        if (motiv_dateObj.getDate() == 1) {
            var ddm = null;
            var ddy = null;
            if ((motiv_dateObj.getMonth() - 1) == -1) {
                ddm = 11;
                ddy = motiv_dateObj.getFullYear() - 1;
            } else {
                ddm = motiv_dateObj.getMonth() - 1;
                ddy = motiv_dateObj.getFullYear();
            };
            motiv_dateObj.setFullYear(ddy);
            motiv_dateObj.setMonth(ddm);
            var temp = alldays(motiv_dateObj);
            motiv_dateObj.setDate(temp);
        } else {
            var new_date = motiv_dateObj.getDate() - 1;
            motiv_dateObj.setDate(new_date);
        }
        init(motiv_dateObj);
    }

    right_btn.onclick = function () {
        if (motiv_dateObj.getDate() == alldays(motiv_dateObj)) {
            var ddm = null;
            var ddy = null;
            if ((motiv_dateObj.getMonth() + 1) == 12) {
                ddm = 0;
                ddy = motiv_dateObj.getFullYear() + 1;
            } else {
                ddm = motiv_dateObj.getMonth() + 1;
                ddy = motiv_dateObj.getFullYear();
            };

            motiv_dateObj.setFullYear(ddy);
            motiv_dateObj.setMonth(ddm, 1);

        } else {
            var new_date = motiv_dateObj.getDate() + 1;
            motiv_dateObj.setDate(new_date);
        }
        init(motiv_dateObj);
    }

    //==================run ==================================
    function run() {
        showtitle();
        showEvent();
        show_Detail();
        init(dateObj);
        var btnss = document.getElementById("btnss");

        btnss.onclick = function () {

            ipcRenderer.send('add_event', dateObj.getTime());
        }

        var btnss_back = document.getElementById("btnss_back");

        btnss_back.onclick = function () {
            ipcRenderer.send('back_main_page');
        }
    }
    run();
    //==================day ==================================
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
    function toMonth(dateObj) {
        var month = dateObj.getMonth();
        switch (month) {
            case 0: return "January";
            case 1: return "Feberuary";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "August";
            case 8: return "September";
            case 9: return "October";
            case 10: return "November";
            case 11: return "December";
            default:
        };
    };
    function isLeapYear(year) {
        if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            return true;
        } else {
            return false;
        };
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
}