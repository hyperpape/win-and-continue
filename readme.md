Library for calculating winning chances for team win and contine
tournaments, like the Nongshim Cup. Assumes ELO style ratings.

Example:

````
let {calculateOdds, Player} = require('./win-and-continue');

const japan_raw = [['Murakawa Daisuke', 3267], ['Cho U', 3288],
                 ['Ichiriki Ryo', 3308], ['Kono Rin', 3358],
                   ['Iyama Yuta', 3536]];
const korea_raw = [['Kang Dongyun', 3456], ['Lee Donghoon', 3467],
                 ['Kim Jiseok', 3507], ['Lee Sedol', 3550],
                 ['Park Junghwan', 3595]];
const china_raw = [['Fan Tingyu', 3419], ['Fan Yunruo', 3435],
                 ['Tuo Jiaxi', 3501], ['Lian Xiao', 3504], ['Ke Jie', 3608]];

const japan_team = japan_raw.map((x) => new Player(x[0], x[1], 'JAPAN'));
const korea_team = korea_raw.map((x) => new Player(x[0], x[1], 'KOREA'));
const china_team = china_raw.map((x) => new Player(x[0], x[1], 'CHINA'));

const teams = [japan_team, korea_team, china_team];
console.log(calculateOdds(teams));

// Probabilities {
//   widestPathProbability: 0.0015185426450060118,
//   widestPath: [ 0, 2, 0, 2, 0, 2, 0, 2, 0, 2 ],
//   probabilities:
//    { '0': 0.05781830055689067,
//      '1': 0.49589372881014715,
//      '2': 0.44628797063296105 } }

````

That example is for the 18th (2016-2017) edition based on goratings
ratings, but without using the actual team orders. Korea was slightly
favored, though we now know that Fan Tingyu was destined to go into
beast mode.

Note also that the widest path is quite
counter-intuitive/non-representative, and will be replaced or removed.

# Performance

Running 3 teams with 5 players each takes only a handful of
milliseconds. Since the tree requires exploring O(2^n) nodes and there
are O(n) copying operations done at each node, significantly larger
teams may take quite a long time, but I haven't tested that.

# Accuracy

The tests show several cases where this library gives the right
results with 1 or 2 players per team. In theory if it works for 2
players, it should work for more.

The probabilities for 2016 look truthy (Korea has 20 points better
average ELO, Japan is ~150 points behind). I'd welcome anyone with
hand-derived probabilities or another library I can use for a
comparison.