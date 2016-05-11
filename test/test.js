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
