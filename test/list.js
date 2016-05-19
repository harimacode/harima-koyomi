var oc = require('../old_calendar.js');

function formatOldDate(y, m, d) {
    var jd = oc.juliusDate(new Date(y,m-1,d));
    var o = oc.oldCalendar(jd);
    var r = oc.rokki(o);
    if (r == "空亡") {
        r = "仏滅";
    }
    var om = o.month;
    var od = o.day;
    var oy = y;
    if (m < om) {
        --oy;
    }
    if (m < 10) {
        m = " " + m;
    }
    if (d < 10) {
        d = " " + d;
    }
    if (om < 10) {
        if (om == 1) {
            om = "正";
        } else {
            om = " " + om;
        }
        if (o.leap) {
            om = " 閏" + om;
        }
    }
    if (od < 10) {
        if (od == 1) {
            od = "朔";
        } else {
            od = " " + od;
        }
    }
    return "西暦" + y + "年 " + m + "月 " + d + "日は、旧暦"
         + oy + "年 " + om + "月 " + od + "日 " + r + "です。";
}

for (var y = 2000; y < 2070; ++y) {
    for (var m = 1; m <= 12; ++m) {
        var days = 31;
        if ([2, 4, 6, 9, 11].indexOf(m) > -1) {
            --days;
        }
        if (m == 2) {
            days -= 2;
        }
        for (var d = 1; d <= days; ++d) {
            console.log(formatOldDate(y, m, d));
        }
    }
}
