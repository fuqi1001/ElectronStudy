var ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
var nurl = require('url');
window.onload = function () {

    var url_temp = nurl.parse(window.location.href, true);
    var queryParam = url_temp.query;
    var times = queryParam.time;
    var file = queryParam.file;
    //console.log(file);
    var fileObj = fs.readFileSync(file);
    fileObj = JSON.parse(fileObj);
    //console.log(fileObj);

    var obody = document.body;
    createbox();
    function createbox() {

        var ddbox = document.createElement("div");
        ddbox.id = "box";
        ddbox.style.display = "none";
        var str = "";
        str += '<div id="title"><div id="prevyear"><<</div><div id="prevmonth"><</div><div id="month"></div><div id="year"></div><div id="nextmonth">></div><div id="nextyear">>></div></div>';
        str += '<div id="week"><div>Sun.</div><div>Mon.</div><div>Tue.</div><div>Wen.</div><div>Thurs.</div><div>Fri.</div><div>Sat.</div></div>';
        str += '<div id="con" class="clearfix"></div>';
        str += '<div id="btns"><div id="nowtime">Current time</div><div id="cleartime">clear</div><input type="text" placeholder="file Name"id="fname"></input><div id="Create_New">New Calendar</div></div>';
        ddbox.innerHTML = str;
        obody.appendChild(ddbox);
    };
    //===================get ele=============================== 
    var omonth = document.getElementById("month");
    var oyear = document.getElementById("year");
    var con = document.getElementById("con");
    var prevmonth = document.getElementById("prevmonth");
    var nextmonth = document.getElementById("nextmonth");
    var prevyear = document.getElementById("prevyear");
    var nextyear = document.getElementById("nextyear");
    var nowtime = document.getElementById("nowtime");
    var date = document.getElementById("date");
    var box = document.getElementById("box");
    var cleartime = document.getElementById("cleartime");
    var Create_New = document.getElementById("Create_New");
    var fname = document.getElementById("fname");
    var eweek = document.getElementById("eweek");


    //===================show date===============================

    box.style.display = "block";

    con.onclick = function (event) {
        if (event.target.innerHTML != "") {
            dateObj.setDate(parseInt(event.target.innerHTML));
            ipcRenderer.send('daily_view', dateObj.getTime());
        }
    };
    cleartime.onclick = function (event) {
        date.value = "";
    };
    //===================set year month===============================



    var dateObj = new Date();
    //create new save file
    Create_New.onclick = function () {
        var file_name = document.getElementById('fname').value;
        //var file_name = dateObj.getFullYear() + "-" + (dateObj.getMonth()+1)+"-"+dateObj.getDate()+"-file"+count+".json";
        console.log(file_name);
        var temp_strstr = "";
        if (file_name == "") {
            alert("Please input a valid file name");
        } else {
            file_name = file_name + ".json";
            fs.writeFile('./save_file/' + file_name, temp_strstr);
            alert("Congratulation! New Calendar file create successed. Please right click and choose it.")
        }
        //
    }

    prevmonth.onclick = function () {//上一月
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
        omonth.innerHTML = toyear(dateObj);
        oyear.innerHTML = dateObj.getFullYear();
        remove();
        oneweek = oneyearoneday(dateObj);
        alld = alldays(dateObj);
        nowd = nowday(dateObj);
        init(oneweek, alld, nowd);
    };
    nextmonth.onclick = function () {
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
        dateObj.setMonth(ddm);
        omonth.innerHTML = toyear(dateObj);
        oyear.innerHTML = dateObj.getFullYear();
        remove();
        oneweek = oneyearoneday(dateObj);
        alld = alldays(dateObj);
        nowd = nowday(dateObj);
        init(oneweek, alld, nowd);
    };
    prevyear.onclick = function () {
        var ddy = dateObj.getFullYear() - 1;
        dateObj.setFullYear(ddy);
        oyear.innerHTML = dateObj.getFullYear();
        remove();
        oneweek = oneyearoneday(dateObj);
        alld = alldays(dateObj);
        nowd = nowday(dateObj);
        init(oneweek, alld, nowd);
    };
    nextyear.onclick = function () {
        var ddy = dateObj.getFullYear() + 1;
        dateObj.setFullYear(ddy);
        oyear.innerHTML = dateObj.getFullYear();
        remove();
        oneweek = oneyearoneday(dateObj);
        alld = alldays(dateObj);
        nowd = nowday(dateObj);
        init(oneweek, alld, nowd);
    };

    nowtime.onclick = function () {
        var dddate = new Date();
        var ddm = dddate.getMonth();
        var ddy = dddate.getFullYear();
        dateObj.setFullYear(ddy);
        dateObj.setMonth(ddm);
        omonth.innerHTML = toyear(dateObj);
        oyear.innerHTML = dateObj.getFullYear();
        remove();
        oneweek = oneyearoneday(dateObj);
        alld = alldays(dateObj);
        nowd = nowday(dateObj);
        init(oneweek, alld, nowd);
    };

    var year = dateObj.getFullYear();
    var month = toyear(dateObj);

    omonth.innerHTML = month;
    oyear.innerHTML = year;
    //===================set day===============================


    var oneweek = oneyearoneday(dateObj);

    var alld = alldays(dateObj);

    var nowd = nowday(dateObj);

    init(oneweek, alld, nowd);

    //===================function===============================

    function hasclass(str, cla) {
        var i = str.search(cla);
        if (i == -1) {
            return false;
        } else {
            return true;
        };
    };

    function remove() {
        con.innerHTML = "";
    };
    function init(oneweek, alld, nowd) {
        //console.log(oneweek);
        //console.log(alld);

        var eweek1 = document.createElement("div");
        var count = 1;
        var temp = 0;
        var count_d = 0;
        eweek1.className = "eweek";

        for (var i = 1; i <= (parseInt(oneweek) + parseInt(alld)); i++) {
            if (i <= oneweek) {
                var eday = document.createElement("div");
                eday.innerHTML = "";
                eweek1.appendChild(eday);
            } else {
                var eday = document.createElement("div");

                //console.log(count_d);

                if (oneweek == 0) {

                    if ((i - parseInt(oneweek)) == nowd) {
                        var date_str = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + (i - parseInt(oneweek));
                        //console.log(date_str);
                        if (typeof fileObj[date_str] !== 'undefined') {
                            //console.log("Event");
                            eday.innerHTML = (i - parseInt(oneweek)) + "&nbsp;&clubs;";
                            eday.className = "ndate";
                            eweek1.appendChild(eday);
                            count_d++;
                        } else {
                            eday.innerHTML = (i - parseInt(oneweek));
                            eday.className = "ndate";
                            eweek1.appendChild(eday);
                            count_d++;
                        }


                    } else {
                        var date_str = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + (i - parseInt(oneweek));
                        //console.log(date_str);
                        if (typeof fileObj[date_str] !== 'undefined') {
                            //console.log("Event");
                            eday.innerHTML = (i - parseInt(oneweek)) + "&nbsp;&clubs;";
                            eday.className = "edate";
                            eweek1.appendChild(eday);
                            count_d++;
                        } else {
                            eday.innerHTML = (i - parseInt(oneweek));
                            eday.className = "edate";
                            eweek1.appendChild(eday);
                            count_d++;
                        }


                    };

                    if (count_d == 7) {
                        //eweek1.appendChild(eday);
                        //console.log(i - parseInt(oneweek));
                        con.appendChild(eweek1);
                        eweek1 = document.createElement("div");
                        eweek1.className = "eweek";
                        count++;
                        count_d = 0;
                    }
                } else {
                    if (((i - 1) % 7) == 0) {
                        //eweek1.appendChild(eday);
                        //console.log(i - parseInt(oneweek));
                        con.appendChild(eweek1);
                        eweek1 = document.createElement("div");
                        eweek1.className = "eweek";
                        count++;
                    }
                    if ((i - parseInt(oneweek)) == nowd) {
                        var date_str = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + (i - parseInt(oneweek));
                        //console.log(date_str);
                        if (typeof fileObj[date_str] !== 'undefined') {
                            //console.log("Event");
                            eday.innerHTML = (i - parseInt(oneweek)) + "&nbsp;&clubs;";
                            eday.className = "ndate";
                            eweek1.appendChild(eday);
                        } else {
                            eday.innerHTML = (i - parseInt(oneweek));
                            eday.className = "ndate";
                            eweek1.appendChild(eday);
                        }


                    } else {
                        var date_str = dateObj.getFullYear() + "-" + (dateObj.getMonth() + 1) + "-" + (i - parseInt(oneweek));
                        //console.log(date_str);
                        if (typeof fileObj[date_str] !== 'undefined') {
                            //console.log("Event");
                            eday.innerHTML = (i - parseInt(oneweek)) + "&nbsp;&clubs;";
                            eday.className = "edate";
                            eweek1.appendChild(eday);
                        } else {
                            eday.innerHTML = (i - parseInt(oneweek)) ;
                            eday.className = "edate";
                            eweek1.appendChild(eday);
                        }

                    };
                }
            }

            temp = i;
        }
        if (temp < count * 7) {
            for (var t = 0; t < (count * 7) - temp; t++) {
                var eday = document.createElement("div");
                eday.innerHTML = "";
                eweek1.appendChild(eday);
            }
        }
        con.appendChild(eweek1);
    };

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

    function toyear(dateObj) {
        var month = dateObj.getMonth()
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
};