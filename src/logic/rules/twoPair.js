import baseResult from "../../utils/baseResult";
import { getValue } from "../../utils/valuesConvertTable";
import { combineGenerator } from "../../utils/combinations";
/**
 * input - userCards :5 cards
 *        replaceFromDeck: [1..5] cards
 * output - is high-card & hightest card value & card list
 */

const isTwoPair = (userCards = [], replaceFromDeck = []) => {
  let replaceFromDeckLength = replaceFromDeck.length;
  let pairs = {
    highPair: {
      value: 0,
      positionN: -1,
      positionM: -1
    },
    lowPair: {
      value: 0,
      positionN: -1,
      positionM: -1
    },
    cards: [],
    rank: 15,
    hightest: 0
  };

  if (replaceFromDeck.length === 0) {
    pairs = searchOnList(pairs, userCards);
  } else if (replaceFromDeck.length === 5) {
    pairs = searchOnList(pairs, replaceFromDeck);
  } else {
    pairs = combinationsSearch(
      pairs,
      userCards,
      replaceFromDeck,
      replaceFromDeckLength
    );
  }
  return Object.assign({}, baseResult, pairs);
};

const searchForPairs = list => {
  let pairs = {
    highPair: {
      value: -1,
      positionN: -1,
      positionM: -1
    },
    lowPair: {
      value: -1,
      positionN: -1,
      positionM: -1
    }
  };
  for (let n = 0; n < list.length - 1; n++) {
    let valueN = getValue(list[n]);
    for (let m = n + 1; m < list.length; m++) {
      let valueM = getValue(list[m]);
      if (valueM === valueN) {
        if (pairs.highPair.positionN === -1) {
          pairs.highPair.positionN = n;
          pairs.highPair.positionM = m;
          pairs.highPair.value = valueN;
          pairs.cards = list;
        } else if (
          pairs.lowPair.positionN === -1 ||
          pairs.lowPair.value < valueN
        ) {
          // switch between pairs
          if (pairs.highPair.value < valueN) {
            // pairs.lowPair.positionN = pairs.highPair.positionN;
            // pairs.lowPair.positionM = pairs.highPair.positionM;
            // pairs.lowPair.value = pairs.highPair.value;

            pairs.lowPair = Object.assign({}, pairs.highPair);
            pairs.highPair.positionN = n;
            pairs.highPair.positionM = m;
            pairs.highPair.value = valueN;
            pairs.rank = 7;
            pairs.cards = list;
          } else {
            pairs.lowPair.positionN = n;
            pairs.lowPair.positionM = m;
            pairs.lowPair.value = valueN;

            pairs.cards = list;
          }
        }
      }
    }
  }

  return pairs;
};

const checkIfBetter = (oldPair, newPair) => {
  if (oldPair.highPair.value <= newPair.highPair.value) {
    if (oldPair.highPair.value < newPair.highPair.value) {
      return true;
    }
    if (
      oldPair.highPair.value === newPair.highPair.value &&
      oldPair.lowPair.value <= newPair.lowPair.value
    ) {
      return true;
    }
  } else {
    return false;
  }
};

const searchOnList = (pairs, list) => {
  let newPair = searchForPairs(list);
  if (newPair.highPair.positionM > -1 && newPair.lowPair.positionM > -1) {
    if (checkIfBetter(pairs, newPair)) {
      pairs = Object.assign({}, newPair);
      pairs.rank = 7;
    }
  }
  return pairs;
};

const combinationsSearch = (
  pairs,
  userCards,
  replaceFromDeck,
  replaceFromDeckLength
) => {
  let combinationsArray = combineGenerator(
    userCards,
    5 - replaceFromDeckLength
  );
  // builc array size 5 with cards from the replacmentDeck and the additional cards from user
  for (let i = 0; i < combinationsArray.length; i++) {
    let additionalCards = combinationsArray[i];

    let searchList =
      additionalCards === undefined
        ? replaceFromDeck
        : replaceFromDeck.concat(combinationsArray[i]);

    if (searchList.length === 5) {
      let newPair = searchForPairs(searchList);

      if (newPair.highPair.positionM > -1 && newPair.lowPair.positionM > -1) {
        if (checkIfBetter(pairs, newPair)) {
          pairs = Object.assign({}, newPair);
          pairs.rank = 7;
        }
      }
    }
  }

  return pairs;
};
export { isTwoPair };