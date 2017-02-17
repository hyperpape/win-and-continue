"use strict";
var mocha_1 = require("mocha");
var assert = require("assert");
var win_and_continue_1 = require("./win-and-continue");
// Random guess
var delta = .000001;
mocha_1.describe('#calculateOdds()', function () {
    mocha_1.describe('3x1 last team is strongest', function () {
        var aRaw = [['A1', 3000]];
        var bRaw = [['B1', 3000]];
        var cRaw = [['C1', 3191]]; // Closest integer value to 75% winning chance
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('initial equal strength teams have equal results', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
        });
        mocha_1.it('191 point elo difference gives last team 75% win chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[2], .75, .01);
        });
    });
    mocha_1.describe('3x1 is equal', function () {
        var aRaw = [['A1', 3000]];
        var bRaw = [['B1', 3000]];
        var cRaw = [['C1', 3000]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('first two equal strength teams have equal chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
        });
        mocha_1.it('last team has same chance as first two combined', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0] + odds.probabilities[1], odds.probabilities[2], delta);
        });
    });
    mocha_1.describe('3x2 last is strongest', function () {
        var aRaw = [['A1', 3000], ['A2', 3000]];
        var bRaw = [['B1', 3000], ['B2', 3000]];
        var cRaw = [['C1', 3191], ['C2', 3191]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('first two equal strength teams have equal chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
        });
        mocha_1.it('191 point elo diference gives last team roughly 81% chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[2], .8085, .001);
        });
        mocha_1.it('191 point elo difference gives first two teams roughly 9% chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], .0957, .001);
        });
    });
    mocha_1.describe('3x2 equal teams', function () {
        var aRaw = [['A1', 3000], ['A2', 3000]];
        var bRaw = [['B1', 3000], ['B2', 3000]];
        var cRaw = [['C1', 3000], ['C2', 3000]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('initial equal strength teams have equal chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
        });
        mocha_1.it('last team should have an advantage', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assert(odds.probabilities[1] < odds.probabilities[2]);
        });
    });
    mocha_1.describe('3x2 first team is strongest', function () {
        var aRaw = [['A1', 3191], ['A2', 3191]];
        var bRaw = [['B1', 3000], ['B2', 3000]];
        var cRaw = [['C1', 3000], ['C2', 3000]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('first team is better than second', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assert(odds.probabilities[0] > odds.probabilities[1]);
        });
    });
    mocha_1.describe('3x5 equal teams all players equal', function () {
        var aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
            ['A5', 3000]];
        var bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
            ['B5', 3000]];
        var cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
            ['C5', 3000]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('first two equal strength teams have equal chance', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
        });
        mocha_1.it('last team should have an advantage', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assert(odds.probabilities[1] < odds.probabilities[2]);
        });
    });
    mocha_1.describe('3x5 equal teams', function () {
        var aRaw = [['A1', 3000], ['A2', 3050], ['A3', 3100], ['A4', 3150],
            ['A5', 3200]];
        var bRaw = [['B1', 3000], ['B2', 3050], ['B3', 3100], ['B4', 3150],
            ['B5', 3200]];
        var cRaw = [['C1', 3000], ['C2', 3050], ['C3', 3100], ['C4', 3150],
            ['C5', 3200]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('initial equal teams are equals', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
        });
        mocha_1.it('last team should have an advantage', function () {
            var odds = win_and_continue_1.calculateOdds(teams);
            assert(odds.probabilities[1] < odds.probabilities[2]);
        });
    });
});
mocha_1.describe('TournamentState', function () {
    mocha_1.describe('#getNextTeam()', function () {
        mocha_1.describe(' with multi player teams that aren\'t eliminated', function () {
            var aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
                ['A5', 3000]];
            var bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
                ['B5', 3000]];
            var cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
                ['C5', 3000]];
            var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
            var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
            var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
            var teams = [aTeam, bTeam, cTeam];
            mocha_1.it('should return team 1 when team 0 beats team 2', function () {
                var indices = [0, 1, 1];
                var t = new win_and_continue_1.TournamentState(teams, indices, 0, 2, 2);
                assert.strictEqual(t.getNextTeam(), 1);
            });
            mocha_1.it('should return team 1 when team 2 beats team 0', function () {
                var indices = [1, 1, 0];
                var t = new win_and_continue_1.TournamentState(teams, indices, 2, 0, 2);
                assert.strictEqual(t.getNextTeam(), 1);
            });
            mocha_1.it('should return team 0 when team 2 beats team 1', function () {
                var indices = [1, 1, 0];
                var t = new win_and_continue_1.TournamentState(teams, indices, 2, 1, 2);
                assert.strictEqual(t.getNextTeam(), 0);
            });
            mocha_1.it('should return team 0 when team 1 beats team 2', function () {
                var indices = [1, 0, 1];
                var t = new win_and_continue_1.TournamentState(teams, indices, 1, 2, 2);
                assert.strictEqual(t.getNextTeam(), 0);
            });
        });
        mocha_1.describe('next team single player teams', function () {
            var aRaw = [['A1', 3000]];
            var bRaw = [['B1', 3000]];
            var cRaw = [['C1', 3000]];
            var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
            var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
            var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
            var teams = [aTeam, bTeam, cTeam];
            mocha_1.it('initial next is 1', function () {
                var indices = [0, 0, 0];
                var t = new win_and_continue_1.TournamentState(teams, indices, 0, 0, 0);
                assert.strictEqual(t.getNextTeam(), 1);
            });
            mocha_1.it('second next is 2', function () {
                var indices = [0, 0, 0];
                var t = new win_and_continue_1.TournamentState(teams, indices, 0, 1, 1);
                assert.strictEqual(t.getNextTeam(), 2);
            });
        });
        mocha_1.describe('when some teams are eliminated', function () {
            var aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
                ['A5', 3000]];
            var bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
                ['B5', 3000]];
            var cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
                ['C5', 3000]];
            var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
            var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
            var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
            var teams = [aTeam, bTeam, cTeam];
            mocha_1.it('should return team 0 when team 2 beats team 0 but team 1 is eliminated', function () {
                var indices = [2, 5, 4];
                var t = new win_and_continue_1.TournamentState(teams, indices, 2, 0, 0);
                assert.strictEqual(t.getNextTeam(), 0);
            });
        });
    });
    mocha_1.describe('#teamIsEliminated(index)', function () {
        var aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
            ['A5', 3000]];
        var bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
            ['B5', 3000]];
        var cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
            ['C5', 3000]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('isEliminated() is accurate', function () {
            var indices = [0, 1, 5];
            var t = new win_and_continue_1.TournamentState(teams, indices, 0, 0, 0);
            assert(!t.teamIsEliminated(0));
            assert(!t.teamIsEliminated(1));
            assert(t.teamIsEliminated(2));
        });
    });
    mocha_1.describe('#numRemainingTeams()', function () {
        var aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
            ['A5', 3000]];
        var bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
            ['B5', 3000]];
        var cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
            ['C5', 3000]];
        var aTeam = aRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'A'); });
        var bTeam = bRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'B'); });
        var cTeam = cRaw.map(function (x) { return new win_and_continue_1.Player(x[0], x[1], 'C'); });
        var teams = [aTeam, bTeam, cTeam];
        mocha_1.it('numRemainingTeams() is accurate', function () {
            var indices = [0, 1, 5];
            var t = new win_and_continue_1.TournamentState(teams, indices, 0, 0, 0);
            assert.equal(t.numRemainingTeams(), 2);
        });
    });
});
function epsilonEquals(x, y, delta) {
    return Math.abs(x - y) < delta;
}
function assertClose(x, y, delta) {
    // TODO make this give useful message
    assert(epsilonEquals(x, y, delta));
}
