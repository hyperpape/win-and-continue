"use strict";
var Player = (function () {
    function Player(name, strength, team) {
        this.name = name;
        this.strength = strength;
        this.team = team;
    }
    return Player;
}());
exports.Player = Player;
var TournamentState = (function () {
    function TournamentState(teams, teamIndices, winningTeam, losingTeam, lastTeam) {
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
    TournamentState.prototype.historyLog = function () {
        return this.history.join();
    };
    TournamentState.prototype.withResult = function (winner, loser, last) {
        var newTeamIndices = this.teamIndices.slice(0);
        newTeamIndices[loser]++;
        var ts = new TournamentState(this.teams, newTeamIndices, winner, loser, last);
        ts.history = this.history.slice(0);
        ts.history.push(loser);
        return ts;
    };
    TournamentState.prototype.getDepth = function () {
        return this.teamIndices.reduce(function (x, y) { return x + y; });
    };
    TournamentState.prototype.teamIsEliminated = function (teamIndex) {
        return this.teamIndices[teamIndex] === this.teams[teamIndex].length;
    };
    TournamentState.prototype.getWinningPlayer = function () {
        var playerIdx = this.teamIndices[this.winningTeam];
        return this.teams[this.winningTeam][playerIdx];
    };
    TournamentState.prototype.getWinningTeam = function () {
        return this.winningTeam;
    };
    TournamentState.prototype.numRemainingTeams = function () {
        var remaining = 0;
        for (var i = 0; i < this.teams.length; i++) {
            if (!this.teamIsEliminated(i)) {
                remaining++;
            }
        }
        return remaining;
    };
    /**
     * Get the index of the next team, without changing state.
     */
    TournamentState.prototype.getNextTeam = function () {
        var newRemainingTeams = this.numRemainingTeams();
        if (newRemainingTeams === 1) {
            return null;
        }
        var nextTeamIdx = this.lastTeam;
        var originalIdx = nextTeamIdx;
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
    };
    TournamentState.prototype.nextPlayer = function () {
        var nextTeamIdx = this.getNextTeam();
        if (null === nextTeamIdx) {
            return null;
        }
        var nextTeam = this.teams[nextTeamIdx];
        var playerIdx = this.teamIndices[nextTeamIdx];
        return nextTeam[playerIdx];
    };
    return TournamentState;
}());
exports.TournamentState = TournamentState;
var Probabilities = (function () {
    function Probabilities() {
        this.widestPathProbability = 0;
        this.widestPath = [];
        this.probabilities = {};
    }
    // On the initial call, winningTeam/lastTeam will not have yet
    // played a game. Naming things is hard.
    Probabilities.prototype.accumulate = function (state, chance) {
        var nextOpponent = state.nextPlayer();
        if (nextOpponent === null) {
            this.update(state, chance);
            return;
        }
        if (!nextOpponent) {
            throw new Error("undefined next opponent, history=" + state.historyLog());
        }
        var winningPlayer = state.getWinningPlayer();
        var winningPlayerProbability = winningChance(winningPlayer, nextOpponent);
        var newStateLeft = state.withResult(state.getWinningTeam(), state.getNextTeam(), state.getNextTeam());
        this.accumulate(newStateLeft, chance * winningPlayerProbability);
        var newStateRight = state.withResult(state.getNextTeam(), state.getWinningTeam(), state.getNextTeam());
        this.accumulate(newStateRight, chance * (1 - winningPlayerProbability));
    };
    Probabilities.prototype.update = function (state, chance) {
        var winningTeam = state.getWinningTeam();
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
    };
    Probabilities.prototype.getProbabilities = function () {
        return this.probabilities;
    };
    Probabilities.prototype.getWidestPath = function () {
        return {
            chance: this.widestPathProbability,
            path: this.widestPath
        };
    };
    return Probabilities;
}());
function calculateOdds(teams) {
    var probabilities = new Probabilities();
    var teamIndices = teams.map(function (x) { return 0; });
    var tournamentState = new TournamentState(teams, teamIndices, 0, 0, 0);
    probabilities.accumulate(tournamentState, 1);
    return probabilities;
}
exports.calculateOdds = calculateOdds;
function winningChance(p1, p2) {
    var denom = 1 + Math.pow(10, (p2.strength - p1.strength) / 400);
    return 1 / denom;
}
