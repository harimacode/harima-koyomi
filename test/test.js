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

describe('juliusDate', function () {
    it('should return correct julius date #1', function () {
        assert.equal(2449473, oc.juliusDate(new Date(1994,4,1)), "1994年5月1日 ＝ 2449473");
        assert.isOk(datesAreSameMinute(new Date(1994,4,1), oc.fromJuliusDate(2449473)));
        assert.equal(2446056, oc.juliusDate(new Date(1984,11,22)), "Date#month は 0 origin"); 
    });
});
describe('dynamicalTime', function () {
    it('should return correct dynamical time', function () {
        assert.equal(2449472.625, oc.dynamicalTime(oc.juliusDate(new Date(1994,4,1))), "1994年5月1日0時 = 2449472.625");
        assert.equal(2449664.2916666665, oc.dynamicalTime(oc.juliusDate(new Date(1994,10,8,16,00))), "1994年11月 8日 16:00(JST)");
    });
});
describe('solarEclipticLongitude', function () {
    it('should return correct solar ecliptic longitude', function () {
        assert.approximately(oc.solarEclipticLongitude(oc.dynamicalTime(oc.juliusDate(new Date(1994,10,8,16,00)))), 225.6456900296, DELTA_P, "1994年11月8日 16:00(JST)");
        
        // 文献中の例から。
        assert.approximately(oc.solarEclipticLongitude(2449431.85263434904943), 359.9999999299906, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449453.295651030494), 21.16941167248130, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449483.01263787953888), 50.09737887498562, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449512.7137218565143), 78.63143984057999, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449542.3526236737596), 106.9141295248953, DELTA_P);
        assert.approximately(oc.solarEclipticLongitude(2449472.625), 40.0342792282334200, DELTA_P);
    });
});
