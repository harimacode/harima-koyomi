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
describe('lunarEclipticLongitude', function() {
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
