import words from './words.json';

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomQuote(locale) {
  return randomItem(words.motivationalQuotes[locale]);
}

export function randomPhrase() {
  return randomItem(words.phrases);
}

export function randomVerb() {
  return randomItem(words.verbs);
}

export function randomCompliment() {
  return randomItem(words.compliments);
}
