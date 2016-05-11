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
