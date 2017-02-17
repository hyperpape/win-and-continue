import { describe, it } from 'mocha';
import * as assert from 'assert';
import { Player, TournamentState, calculateOdds } from './win-and-continue';

// Random guess
const delta = .000001;

describe('#calculateOdds()', function () {
    describe('3x1 last team is strongest', function() {
	const aRaw = [['A1', 3000]];
	const bRaw = [['B1', 3000]];
	const cRaw = [['C1', 3191]]; // Closest integer value to 75% winning chance

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('initial equal strength teams have equal results', function() {
            const odds = calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
	});

	it('191 point elo difference gives last team 75% win chance', function() {
            const odds = calculateOdds(teams);
	    assertClose(odds.probabilities[2], .75, .01);
	});
    });

    describe('3x1 is equal', function () {
	const aRaw = [['A1', 3000]];
	const bRaw = [['B1', 3000]];
	const cRaw = [['C1', 3000]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('first two equal strength teams have equal chance', function() {
            const odds = calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
	});

	it('last team has same chance as first two combined', function() {
            const odds = calculateOdds(teams);
	    assertClose(odds.probabilities[0] + odds.probabilities[1], odds.probabilities[2], delta);
	});
    });

    describe('3x2 last is strongest', function() {
	const aRaw = [['A1', 3000], ['A2', 3000]];
	const bRaw = [['B1', 3000], ['B2', 3000]];
	const cRaw = [['C1', 3191], ['C2', 3191]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('first two equal strength teams have equal chance', function() {
            const odds = calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
	});

	it('191 point elo diference gives last team roughly 81% chance', function() {
            const odds = calculateOdds(teams);
            assertClose(odds.probabilities[2], .8085, .001);
	});

	it('191 point elo difference gives first two teams roughly 9% chance', function() {
	    const odds = calculateOdds(teams);
	    assertClose(odds.probabilities[0], .0957, .001);
	});
    });

    describe('3x2 equal teams', function () {
	const aRaw = [['A1', 3000], ['A2', 3000]];
	const bRaw = [['B1', 3000], ['B2', 3000]];
	const cRaw = [['C1', 3000], ['C2', 3000]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('initial equal strength teams have equal chance', function() {
            const odds = calculateOdds(teams);
            assertClose(odds.probabilities[0], odds.probabilities[1], delta);
	});

	it('last team should have an advantage', function() {
            const odds = calculateOdds(teams);
            assert(odds.probabilities[1] < odds.probabilities[2]);
	});
    });

    describe('3x2 first team is strongest', function() {
	const aRaw = [['A1', 3191], ['A2', 3191]];
	const bRaw = [['B1', 3000], ['B2', 3000]];
	const cRaw = [['C1', 3000], ['C2', 3000]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('first team is better than second', function() {
	    const odds = calculateOdds(teams);
	    assert(odds.probabilities[0] > odds.probabilities[1]);
	});
    });

    describe('3x5 equal teams all players equal', function() {
	const aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
                      ['A5', 3000]];
	const bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
                      ['B5', 3000]];
	const cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
                      ['C5', 3000]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('first two equal strength teams have equal chance', function() {
	    const odds = calculateOdds(teams);
	    assertClose(odds.probabilities[0], odds.probabilities[1], delta);
	});

	it('last team should have an advantage', function() {
            const odds = calculateOdds(teams);
            assert(odds.probabilities[1] < odds.probabilities[2]);
	});

    });

    describe('3x5 equal teams', function() {
	const aRaw = [['A1', 3000], ['A2', 3050], ['A3', 3100], ['A4', 3150],
                      ['A5', 3200]];
	const bRaw = [['B1', 3000], ['B2', 3050], ['B3', 3100], ['B4', 3150],
                      ['B5', 3200]];
	const cRaw = [['C1', 3000], ['C2', 3050], ['C3', 3100], ['C4', 3150],
                      ['C5', 3200]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('initial equal teams are equals', function() {
	    const odds = calculateOdds(teams);
	    assertClose(odds.probabilities[0], odds.probabilities[1], delta);
	});

	it('last team should have an advantage', function() {
            const odds = calculateOdds(teams);
            assert(odds.probabilities[1] < odds.probabilities[2]);
	});

    });

});



describe('TournamentState', function() {
    describe('#getNextTeam()', function() {
	describe(' with multi player teams that aren\'t eliminated', function() {
	    const aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
			  ['A5', 3000]];
	    const bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
			  ['B5', 3000]];
	    const cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
			  ['C5', 3000]];

	    const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	    const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	    const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	    const teams = [aTeam, bTeam, cTeam];

	    it('should return team 1 when team 0 beats team 2', function() {
		const indices = [0, 1, 1];
		const t = new TournamentState(teams, indices, 0, 2, 2);
		assert.strictEqual(t.getNextTeam(), 1);
	    });

	    it('should return team 1 when team 2 beats team 0', function() {
		const indices = [1, 1, 0];
		const t = new TournamentState(teams, indices, 2, 0, 2);
		assert.strictEqual(t.getNextTeam(), 1);
	    });
	    
	    it('should return team 0 when team 2 beats team 1', function() {
		const indices = [1, 1, 0];
		const t = new TournamentState(teams, indices, 2, 1, 2);
		assert.strictEqual(t.getNextTeam(), 0);
	    });

	    it('should return team 0 when team 1 beats team 2', function() {
		const indices = [1, 0, 1];
		const t = new TournamentState(teams, indices, 1, 2, 2);
		assert.strictEqual(t.getNextTeam(), 0);
	    });

	});


	describe('next team single player teams', function() {
	    const aRaw = [['A1', 3000]];
	    const bRaw = [['B1', 3000]];
	    const cRaw = [['C1', 3000]];

	    const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	    const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	    const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));
	    const teams = [aTeam, bTeam, cTeam];

	    it('initial next is 1', function() {
		const indices = [0, 0, 0];
		const t = new TournamentState(teams, indices, 0, 0, 0);
		assert.strictEqual(t.getNextTeam(), 1);
	    });

	    it('second next is 2', function() {
		const indices = [0, 0, 0];
		const t = new TournamentState(teams, indices, 0, 1, 1);
		assert.strictEqual(t.getNextTeam(), 2);
	    });
	});

	describe('when some teams are eliminated', function() {
	    const aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
			  ['A5', 3000]];
	    const bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
			  ['B5', 3000]];
	    const cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
			  ['C5', 3000]];

	    const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	    const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	    const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	    const teams = [aTeam, bTeam, cTeam];

	    it('should return team 0 when team 2 beats team 0 but team 1 is eliminated', function() {
		const indices = [2, 5, 4];
		const t = new TournamentState(teams, indices, 2, 0, 0);
		assert.strictEqual(t.getNextTeam(), 0);
	    });
	});
    });

    describe('#teamIsEliminated(index)', function() {
	const aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
		      ['A5', 3000]];
	const bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
		      ['B5', 3000]];
	const cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
		      ['C5', 3000]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('isEliminated() is accurate', function() {
	    const indices = [0, 1, 5];
	    const t = new TournamentState(teams, indices, 0, 0, 0);
	    assert(!t.teamIsEliminated(0));
	    assert(!t.teamIsEliminated(1));
	    assert(t.teamIsEliminated(2));
	});
    });

    describe('#numRemainingTeams()', function() {

	const aRaw = [['A1', 3000], ['A2', 3000], ['A3', 3000], ['A4', 3000],
		      ['A5', 3000]];
	const bRaw = [['B1', 3000], ['B2', 3000], ['B3', 3000], ['B4', 3000],
		      ['B5', 3000]];
	const cRaw = [['C1', 3000], ['C2', 3000], ['C3', 3000], ['C4', 3000],
		      ['C5', 3000]];

	const aTeam = aRaw.map((x) => new Player(x[0], x[1], 'A'));

	const bTeam = bRaw.map((x) => new Player(x[0], x[1], 'B'));

	const cTeam = cRaw.map((x) => new Player(x[0], x[1], 'C'));

	const teams = [aTeam, bTeam, cTeam];

	it('numRemainingTeams() is accurate', function() {
	    const indices = [0, 1, 5];
	    const t = new TournamentState(teams, indices, 0, 0, 0);
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
