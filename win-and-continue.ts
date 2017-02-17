import * as fs from "fs";

export class Player {
    name: string;
    strength: number;
    team: string;

    constructor(name, strength, team) {
        this.name = name;
        this.strength = strength;
        this.team = team;
    }
}

export class TournamentState {
    teams: Array<Array<Player>>;
    // An array of the indices of the current/next live player for the
    // teams array. If the index is for the winning team, the player
    // will be the one who just won. If the index is for any other
    // team, the player will not yet have played. Though somewhat
    // confusing, this means that we always the losing team's index
    // when processing the result of a game.
    teamIndices: Array<number>;
    // Indices of the winning team, losingTeam, and lastTeam in the teams array. See
    // getNextTeam() for an explanation of why all three are necessary.
    winningTeam: number;
    losingTeam: number;
    lastTeam: number;
    history: Array<number>;

    constructor(teams, teamIndices, winningTeam, losingTeam, lastTeam) {
	// Initially, the winningTeam, losingTeam and lastTeam are meaningless, so long as we pair the first two teams correctly.
	// Once they're not all zero, these become important sanity checks.
        if (winningTeam && (winningTeam === losingTeam)) {
            throw new Error("winningTeam and losingTeam must not be equal");
        }
        if (!(winningTeam === lastTeam || losingTeam === lastTeam)) {
            throw new Error("either winningTeam or losingTeam must === lastTeam");
        }
        this.teams = teams;
        this.teamIndices = teamIndices;
        this.winningTeam = winningTeam;
        this.losingTeam = losingTeam;
        this.lastTeam = lastTeam;
        this.history = [];
    }

    historyLog() {
	return this.history.join();
    }

    withResult(winner, loser, last): TournamentState {
        const newTeamIndices = this.teamIndices.slice(0);
        newTeamIndices[loser]++;
        const ts = new TournamentState(this.teams, newTeamIndices, winner, loser, last);
        ts.history = this.history.slice(0);
        ts.history.push(loser);
        return ts;
    }

    getDepth() {
        return this.teamIndices.reduce((x, y) => x + y);
    }

    teamIsEliminated(teamIndex) {
        return this.teamIndices[teamIndex] === this.teams[teamIndex].length;
    }

    getWinningPlayer() {
        const playerIdx = this.teamIndices[this.winningTeam];
        return this.teams[this.winningTeam][playerIdx];
    }

    getWinningTeam() {
        return this.winningTeam;
    }

    numRemainingTeams() {
	let remaining = 0;
	for (let i = 0; i < this.teams.length; i++) {
	    if (!this.teamIsEliminated(i)) {
		remaining++;
	    }
	}
	return remaining;
    }

    /**
     * Get the index of the next team, without changing state.
     */
    getNextTeam() {
	const newRemainingTeams = this.numRemainingTeams();
	if (newRemainingTeams === 1) {
	    return null;
	}
        let nextTeamIdx = this.lastTeam;
	const originalIdx = nextTeamIdx;
	while (true) {
	    // When there are two remaining teams, we can take from
	    // the losing team. When there are three or more, we never
	    // take from the losing team.
	    if (newRemainingTeams === 2) {
		nextTeamIdx = (nextTeamIdx + 1) % this.teams.length;
		if (this.winningTeam === nextTeamIdx) {
		    continue;
		}
		else if (this.teamIsEliminated(nextTeamIdx)) {
		    continue;
		}
		return nextTeamIdx;
	    }
	    else if (newRemainingTeams === 3) {
		nextTeamIdx = (nextTeamIdx + 1) % this.teams.length;
		if (this.winningTeam === nextTeamIdx) {
                    continue;
		}
		else if (nextTeamIdx === this.lastTeam) {
		    continue;
		}
		else if (nextTeamIdx === this.losingTeam) {
                    continue;
		}
		else if (this.teamIsEliminated(nextTeamIdx)) {
                    continue;
		}
		return nextTeamIdx;
            }
	    else {
		throw new Error("Algorithm does not yet know how to decide next team when more than 3 teams are involved");
	    }
	}
    }

    nextPlayer() {
        const nextTeamIdx = this.getNextTeam();
        if (null === nextTeamIdx) {
            return null;
        }
        const nextTeam = this.teams[nextTeamIdx];
        const playerIdx = this.teamIndices[nextTeamIdx];
        return nextTeam[playerIdx];
    }
}

class Probabilities {

    // TODO: better name
    probabilities;

    widestPathProbability: number = 0;

    widestPath: Array<number> = [];

    constructor() {
        this.probabilities = {};
    }

    // On the initial call, winningTeam/lastTeam will not have yet
    // played a game. Naming things is hard.
    accumulate(state: TournamentState, chance: number) {

        const nextOpponent = state.nextPlayer();
        if (nextOpponent === null) {
	    this.update(state, chance);
	    return;
        }

        if (!nextOpponent) {
            throw new Error("undefined next opponent, history=" + state.historyLog());
        }
        const winningPlayer = state.getWinningPlayer();
        const winningPlayerProbability = winningChance(winningPlayer, nextOpponent);

        const newStateLeft = state.withResult(state.getWinningTeam(), state.getNextTeam(), state.getNextTeam());
        this.accumulate(newStateLeft, chance * winningPlayerProbability);

        const newStateRight = state.withResult(state.getNextTeam(), state.getWinningTeam(), state.getNextTeam());
        this.accumulate(newStateRight, chance * (1 - winningPlayerProbability));
    }

    update(state: TournamentState, chance: number) {
        const winningTeam = state.getWinningTeam();
        if (winningTeam in this.probabilities) {
            this.probabilities[winningTeam] += chance;
        }
        else {
            this.probabilities[winningTeam] = chance;
        }

	if (chance > this.widestPathProbability) {
	    this.widestPathProbability = chance;
	    this.widestPath = state.history.slice(0);
	}
    }

    getProbabilities() {
	return this.probabilities;
    }

    getWidestPath() {
	return {
	    chance: this.widestPathProbability,
	    path: this.widestPath
	};
    }
}


export function calculateOdds(teams) { // , debugFileName) {
    const probabilities = new Probabilities();
    const teamIndices = teams.map((x) => 0);
    const tournamentState = new TournamentState(teams, teamIndices, 0, 0, 0);
    probabilities.accumulate(tournamentState, 1);
    return probabilities;
}

function winningChance(p1: Player, p2: Player) {
    const denom = 1 + Math.pow(10, (p2.strength - p1.strength) / 400);
    return 1 / denom;
}
