var assert = require('chai').assert;
var oc = require('../old_calendar.js');

function datesAreSameMinute(a, b) {
    // 分までだけ比較する。
    return a.getFullYear() == b.getFullYear()
        && a.getMonth() == b.getMonth()
        && a.getDate() == b.getDate()
        && a.getHours() == b.getHours()
        && a.getMinutes() == b.getMinutes();
}
const DELTA_P = 0.00000000001;
const DELTA_R = 0.0001;

describe('juliusDate', function () {
    it('should return correct julius date #1', function () {
        assert.equal(oc.juliusDate(new Date(1994,4,1)), 2449473, '1994年5月1日 ＝ 2449473');
        assert.isOk(datesAreSameMinute(oc.fromJuliusDate(2449473), new Date(1994,4,1)));
        assert.equal(oc.juliusDate(new Date(1984,11,22)), 2446056, 'Date#month は 0 origin'); 
    });
});
describe('dynamicalTime', function () {
    it('should return correct dynamical time', function () {
        assert.equal(oc.dynamicalTime(oc.juliusDate(new Date(1994,4,1))), 2449472.625, '1994年5月1日0時 = 2449472.625');
        assert.equal(oc.dynamicalTime(oc.juliusDate(new Date(1994,10,8,16,00))), 2449664.2916666665, '1994年11月 8日 16:00(JST)');
    });
});
describe('solarEclipticLongitude', function () {
    it('should return correct solar ecliptic longitude', function () {
        assert.approximately(oc.solarEclipticLongitude(oc.dynamicalTime(oc.juliusDate(new Date(1994,10,8,16,00)))), 225.6456900296, DELTA_P, '1994年11月8日 16:00(JST)');
        
        // 文献中の例から。
        assert.approximately(oc.solarEclipticLongitude(2449431.85263434904943), 359.9999999299906, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449453.295651030494), 21.16941167248130, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449483.01263787953888), 50.09737887498562, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449512.7137218565143), 78.63143984057999, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449542.3526236737596), 106.9141295248953, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449472.625), 40.0342792282334200, DELTA_P);
    });
});
describe('lunarEclipticLongitude', function () {
    it('should return correct lunar ecliptic longitude', function () {
        // FIXME: 精度が 0.0001 程度しかなく、低すぎる気がするので
        // 計算部分に見直しが必要かも。
        
        // 文献中の例から。
        assert.approximately(oc.lunarEclipticLongitude(2449431.85263434904943), 93.93361186916204, DELTA_R);
        assert.approximately(oc.lunarEclipticLongitude(2449453.295651030494), 24.23809602459182, DELTA_R);
        assert.approximately(oc.lunarEclipticLongitude(2449483.01263787953888), 53.34937446649215, DELTA_R);
        assert.approximately(oc.lunarEclipticLongitude(2449512.7137218565143), 82.69589256228039, DELTA_R);
        assert.approximately(oc.lunarEclipticLongitude(2449542.3526236737596), 112.2766488159473, DELTA_R);
    });
});
describe('findNibunNishi', function () {
    it('should return correct nibun nishi', function () {
        assert.approximately(oc.findNibunNishi(2449472.625)[1], 2449432.2276343490000000, DELTA_R);
        assert.isOk(datesAreSameMinute(oc.fromJuliusDate(oc.findNibunNishi(2449472.625)[1]), new Date(1994,2,21,5,27,48)));
        assert.approximately(oc.findNibunNishi(oc.juliusDate(new Date(1984,11,23)))[1], 2446056.0489, DELTA_R);
    });
});
describe('findSeason', function () {
    it('should find seasons correctly', function () {
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 1, 3))), 3);
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 1, 4))), 0, '2016年2月4日 は春'); 
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 4, 4))), 0);
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 4, 5))), 1, '2016年5月5日 は夏'); 
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 7, 6))), 1);
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 7, 7))), 2, '2016年8月7日 は秋'); 
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 10, 6))), 2);
        assert.equal(oc.findSeason(oc.juliusDate(new Date(2016, 10, 7))), 3, '2016年11月7日 は冬'); 
    });
});
describe('findChukis', function () {
    it('should find chukis correctly', function () {
        var result = oc.findChukis(2449432.2276343490);
        var answers = [
            2449462.6910369310000,
            2449493.6580418450000,
            2449524.9906033690000,
        ];
        for (var i = 0; i < answers.length; ++i) {
            assert.approximately(result[i], answers[i], DELTA_R);
        } 
        
        var result2 = oc.findChukis(oc.findNibunNishi(oc.juliusDate(new Date(1993,4,1)))[1]);
        var answers2 = [
            2449097.4502,
            2449128.4174,
            2449159.7497,
        ];
        for (var i = 0; i < answers2.length; ++i) {
            assert.approximately(result2[i], answers2[i], DELTA_R);
        } 
    });
});
describe('findSaku', function () {
    it('should find a saku correctly', function () {
        var saku = oc.findSaku(2449431.85263434904943);
        assert.approximately(saku, 2449423.6706510314940, DELTA_R);
        // alert(fromJuliusDate(saku));
    });
});
describe('findSakus', function () {
    it('should find sakus correctly', function () {
        var sakus = oc.findSakus(2449431.85263434904943);
        var answers = [
            2449423.6706510314940,
            2449453.3876378879538,
            2449483.0887218565143,
            2449512.7276236737596,
            2449542.2768841335603,
        ];
        for (var i = 0; i < answers.length; ++i) {
            assert.approximately(sakus[i], answers[i], DELTA_R);
        } 

        var sakus2 = oc.findSakus(oc.findNibunNishi(oc.juliusDate(new Date(1993,4,1)))[1]);
        var answers2 = [
            2449039.9209,
            2449069.6773,
            2449099.3680,
            2449128.9637,
            2449158.4540,
        ];
        for (var i = 0; i < answers2.length; ++i) {
            assert.approximately(sakus2[i], answers2[i], DELTA_R);
        }
        
        var sakus3 = oc.findSakus(oc.findNibunNishi(oc.juliusDate(new Date(1985,0,1)))[1]);
        var answers3 = [
            2446056.8671,
            2446086.4793,
            2446116.1560,
            2446145.8755,
            2446175.6000,
        ];
        for (var i = 0; i < answers3.length; ++i) {
            assert.approximately(sakus3[i], answers3[i], DELTA_R);
        } 
    });
});
describe('oldCalendar', function () {
    it('should return correct old calendar date', function () {
        assert.equal(oc.oldCalendar(oc.juliusDate(new Date(1994,4,1))).toString(), '3月21日', '1994年5月1日');
        assert.equal(oc.oldCalendar(oc.juliusDate(new Date(1993,4,1))).toString(), '閏3月10日', '1993年5月1日');
        assert.equal(oc.oldCalendar(oc.juliusDate(new Date(1985,0,1))).toString(), '11月11日', '1985年1月1日');
        // alert(oldCalendar(juliusDate(new Date(2012,0,1))));
        
        // // 2002-2021 年元日 は http://www.ajnet.ne.jp/diary/ との一致を確認
        // var dates = [];
        // for (var y = 2002; y < 2051; ++y) {
        //     dates.push(y + ':' + oldCalendar(juliusDate(new Date(y,0,1))));
        // }
        // alert(dates.join('\n'));
        
        // 2016 年については正しい旧暦が得られていることを確認
        // var dates = [];
        // var jd = juliusDate(new Date(2016,6,1));
        // for (var i = 0; i < 200; ++i) {
        //     var d = fromJuliusDate(jd + i);
        //     var s = (d.getMonth()+1) + "/" + d.getDate();
        //     dates.push(s + '=>' + oldCalendar(jd + i));
        // }
        // alert(dates.join('\n'));
        assert.equal(oc.oldCalendar(oc.juliusDate(new Date(2017,8,20))).toString(), '8月1日');
    });
});
describe('rokki', function () {
    it('should return correct rokkis', function () {
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 17)), '先勝');
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 18)), '友引');
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 19)), '先負');
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 20)), '空亡');
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 21)), '大安');
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 22)), '赤口');
        assert.equal(oc.rokki(new oc.OldDate(false, 3, 23)), '先勝');
        assert.equal(oc.rokki(new oc.OldDate(true, 3, 23)), '先勝', '閏月も同じだったはず'); 
    });
});
describe('eto', function () {
    it('should return correct etos', function () {
        assert.equal(oc.eto(oc.juliusDate(new Date(1873,0,12))), '甲子', '1873年 1月12日 が甲子の基準日');
        assert.equal(oc.eto(oc.juliusDate(new Date(2014,3,16))), '丁巳');
        assert.equal(oc.eto(oc.juliusDate(new Date(2014,3,17))), '戊午');
        assert.equal(oc.eto(oc.juliusDate(new Date(2014,3,18))), '己未');
        assert.equal(oc.eto(oc.juliusDate(new Date(2014,3,19))), '庚申');
    });
});
describe('kyusei', function () {
    it('should return correct kyuseis', function () {
        assert.equal(oc.kyusei(oc.juliusDate(new Date(2014,3,16))), '六白');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(2014,3,17))), '七赤');

        assert.equal(oc.kyusei(oc.juliusDate(new Date(2008,11,18))), '八白');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(2008,11,19))), '七赤');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(2008,11,20))), '七赤');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(2008,11,21))), '八白');

        assert.equal(oc.kyusei(oc.juliusDate(new Date(1997,5,19))), '二黒');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(1997,5,20))), '三碧');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(1997,5,21))), '三碧');
        assert.equal(oc.kyusei(oc.juliusDate(new Date(1997,5,22))), '二黒');

        // var r = [];    
        // for (var i = 0; i < 6; ++i) {
        //     r.push(kyusei(juliusDate(new Date(1997,5,18+i))));
        // }
        // alert(r);
    });
});
describe('findSetsugetsu', function () {
    it('should find setsugetsu correctly', function () {
        var s;
        // 2016年3月20日=春分→2月節、3/5
        s = oc.findSetsugetsu(oc.juliusDate(new Date(2016,2,20)));
        assert.equal(s[0], 2, '2月節');
        assert.isOk(datesAreSameMinute(oc.fromJuliusDate(Math.floor(s[1])), new Date(2016,2,5)), '3/5'); 
        
        // 2016年4月20日=穀雨→3月節、4/4
        s = oc.findSetsugetsu(oc.juliusDate(new Date(2016,3,20)));
        assert.equal(s[0], 3, '3月節');
        assert.isOk(datesAreSameMinute(oc.fromJuliusDate(Math.floor(s[1])), new Date(2016,3,4)), '4/4'); 
        
        // 2016年3月4日=1月節,2/4
        s = oc.findSetsugetsu(oc.juliusDate(new Date(2016,2,4)));
        assert.equal(s[0], 1, '1月節');
        assert.isOk(datesAreSameMinute(oc.fromJuliusDate(Math.floor(s[1])), new Date(2016,1,4)), '2/4'); 
        // 2016年3月5日=2月節,3/5
        s = oc.findSetsugetsu(oc.juliusDate(new Date(2016,2,5)));
        assert.equal(s[0], 2, '2月節');
        assert.isOk(datesAreSameMinute(oc.fromJuliusDate(Math.floor(s[1])), new Date(2016,2,5)), '3/5'); 
    });
});
describe('choku', function () {
    it('should return correct choku', function () {
        assert.equal(oc.choku(oc.juliusDate(new Date(2014,3,16))), '除');
        assert.equal(oc.choku(oc.juliusDate(new Date(2014,4,4))), '危');
        assert.equal(oc.choku(oc.juliusDate(new Date(2014,4,5))), '危');
        assert.equal(oc.choku(oc.juliusDate(new Date(2014,3,16,12))), '除', 'jd が整数とならないパターン'); 
    });
});
describe('shuku', function () {
    it('should return correct shuku', function () {
        assert.equal(oc.shuku(oc.oldCalendar(oc.juliusDate(new Date(2014,3,16)))), '心');
        assert.equal(oc.shuku(oc.oldCalendar(oc.juliusDate(new Date(2014,3,17)))), '尾');
        assert.equal(oc.shuku(oc.oldCalendar(oc.juliusDate(new Date(2014,4,1)))), '参');
        assert.equal(oc.shuku(oc.oldCalendar(oc.juliusDate(new Date(2014,4,12)))), '房');
        assert.equal(oc.shuku(oc.oldCalendar(oc.juliusDate(new Date(2014,4,13)))), '心');
    });
});
describe('nattin', function () {
    it('should return correct nattin', function () {
        assert.equal(oc.nattin(oc.juliusDate(new Date(2014,3,16))), '沙中土');
        assert.equal(oc.nattin(oc.juliusDate(new Date(2014,3,17))), '天上火');
    });
});
describe('nijuShisekki', function () {
    it('should return correct 24-sekki', function () {
        assert.equal(oc.nijuShisekki(oc.juliusDate(new Date(2014,4,4))), '');
        assert.equal(oc.nijuShisekki(oc.juliusDate(new Date(2014,4,5))), '立夏');
        assert.equal(oc.nijuShisekki(oc.juliusDate(new Date(2014,4,6))), '');
    });
});
describe('isSetsubun', function () {
    it('should return if it is setsubun', function () {
        assert.equal(oc.isSetsubun(oc.juliusDate(new Date(2016,1,2))), false);
        assert.equal(oc.isSetsubun(oc.juliusDate(new Date(2016,1,4))), false);
        assert.equal(oc.isSetsubun(oc.juliusDate(new Date(2016,1,3))), true);

        assert.equal(oc.isSetsubun(oc.juliusDate(new Date(2025,1,1))), false);
        assert.equal(oc.isSetsubun(oc.juliusDate(new Date(2025,1,2))), true);
        assert.equal(oc.isSetsubun(oc.juliusDate(new Date(2025,1,3))), false);
    });
});
describe('isHachijuHachiya', function () {
    it('should return if it is 88-ya', function () {
        assert.equal(oc.isHachijuHachiya(oc.juliusDate(new Date(2016,3,30))), false);
        assert.equal(oc.isHachijuHachiya(oc.juliusDate(new Date(2016,4,1))), true);
        assert.equal(oc.isHachijuHachiya(oc.juliusDate(new Date(2016,4,2))), false);
        
        assert.equal(oc.isHachijuHachiya(oc.juliusDate(new Date(2017,4,2))), true);
        assert.equal(oc.isHachijuHachiya(oc.juliusDate(new Date(2018,4,2))), true);
        assert.equal(oc.isHachijuHachiya(oc.juliusDate(new Date(2019,4,2))), true);
    });
});
describe('isHiganStart', function () {
    it('should return if it is the start day of higan', function () {
        assert.equal(oc.isHiganStart(oc.juliusDate(new Date(2014,8,19))), false);
        assert.equal(oc.isHiganStart(oc.juliusDate(new Date(2014,8,20))), true);
        assert.equal(oc.isHiganStart(oc.juliusDate(new Date(2014,8,21))), false);
    });
});
describe('isHiganEnd', function () {
    it('should return if it is the end day of higan', function () {
        assert.equal(oc.isHiganEnd(oc.juliusDate(new Date(2014,8,25))), false);
        assert.equal(oc.isHiganEnd(oc.juliusDate(new Date(2014,8,26))), true);
        assert.equal(oc.isHiganEnd(oc.juliusDate(new Date(2014,8,27))), false);
    });
});
describe('isSyanichi', function () {
    it('should return if it is spring syanichi', function () {
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2007,2,24))), '');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2007,2,25))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2007,2,26))), '');

        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2008,2,19))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2009,2,24))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2010,2,19))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2011,2,24))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2012,2,18))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2013,2,23))), '社日(春)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2014,2,18))), '社日(春)');

    });
    it('should return if it is fall syanichi', function () {
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2007,8,20))), '');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2007,8,21))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2007,8,22))), '');

        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2008,8,25))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2009,8,20))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2010,8,25))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2011,8,20))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2012,8,24))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2013,8,19))), '社日(秋)');
        assert.equal(oc.isSyanichi(oc.juliusDate(new Date(2014,8,24))), '社日(秋)');
    });
});
describe('isSanpuku', function () {
    it('should return if it is syofuku', function () {
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,6,16))), '');
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,6,17))), '初伏');
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,6,18))), '');

        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2014,6,18))), '初伏');
    });
    it('should return if it is chufuku', function () {
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,6,26))), '');
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,6,27))), '中伏');
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,6,28))), '');

        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2014,6,28))), '中伏');
    });
    it('should return if it is mappuku', function () {
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,7,15))), '');
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,7,16))), '末伏');
        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2016,7,17))), '');

        assert.equal(oc.isSanpuku(oc.juliusDate(new Date(2014,7,7))), '末伏');
    });
});
