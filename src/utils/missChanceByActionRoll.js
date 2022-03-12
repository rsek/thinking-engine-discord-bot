import _ from "lodash";

const challengeValues = _.range(1, 11);
const actionDieValues = _.range(1, 7);

const bonuses = _.range(0, 6);

const actionScoreMax = 10;

const challengePairs = challengeValues.map(die1 => challengeValues.map(die2 => [die1, die2])).flat(1);

function isMiss(actionScoreRaw, challengeDie1, challengeDie2) {
  const challengeDice = [challengeDie1, challengeDie2]
  const actionScore = Math.min(actionScoreMax, actionScoreRaw);
  return challengeDice.every(die => actionScore <= die);
}

const data2d = challengePairs.map(challengeDice => bonuses.map(bonus => [challengeDice, bonus])).flat(1);

let tableString = "";

let tableMap = new Map(
  challengePairs.map(pair => [pair, []])
);

data2d.forEach((row) => {
  let challengeDice = row[0];
  let misses = 0;
  let actionScores = actionDieValues.map(value => [value + row[1]]);
  actionScores.forEach(actionScore => misses += Number(isMiss(_.sum(actionScore), ...challengeDice)));
  let missProbability = misses / 6;
  let currentRow = tableMap.get(challengeDice);
  tableMap.set(challengeDice, currentRow.concat(missProbability));
});


bonuses.forEach((bonus, index) => {
  let probabilities = [];
  let probabilitiesWithRerolls = [];
  tableMap.forEach((value, key, map) => {
    let probability = value[index];
    let probabilityWithReroll = probability ** 2;
    probabilities.push(probability);
    probabilitiesWithRerolls.push(probabilityWithReroll);
    // console.log(`Probability of miss with 1d6+${bonus} vs. ${key}: ${probability.toPrecision(2)} (${probabilityWithReroll.toPrecision(2)} with reroll)`);
  });
  let probabilityMean = _.mean(probabilities);
  let probabilityWithRerollMean = _.mean(probabilitiesWithRerolls);
  let probabilityOfHit = ((1 - probabilityMean));
  let probabilityOfHitWithReroll = ((1 - probabilityWithRerollMean));

  console.log(`Chance of hit at +${bonus}: ${percent(probabilityOfHit)}. With reroll on miss: ${percent(probabilityOfHitWithReroll)} (+${percent(probabilityOfHitWithReroll - probabilityOfHit)})`);
});

function percent(num) {
  return `${(num * 100).toPrecision(3)}%`
}

// for the reroll on a miss to