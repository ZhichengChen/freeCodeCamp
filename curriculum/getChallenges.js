const path = require('path');
const { findIndex } = require('lodash');
const readDirP = require('readdirp-walk');
const { parseMarkdown } = require('@freecodecamp/challenge-md-parser');

const { dasherize } = require('../utils/slugs');

const challengesDir = path.resolve(__dirname, './challenges');
const metaDir = path.resolve(challengesDir, '_meta');
exports.challengesDir = challengesDir;
exports.metaDir = metaDir;

function getChallengesDirForLang(lang) {
  return path.resolve(challengesDir, `./${lang}`);
}

exports.getChallengesDirForLang = getChallengesDirForLang;

exports.getChallengesForLang = function getChallengesForLang(lang) {
  let curriculum = {};
  return new Promise(resolve => {
    let running = 1;
    let langArr = lang.split(',');
    let i = 0;
    function done() {
      if (--running === 0) {
        if (++i === langArr.length) {
          resolve(curriculum);
        } else {
          running = 1;
          readDir();
        }
      }
    }
    function readDir() {
      readDirP({ root: getChallengesDirForLang(langArr[i]) })
        .on('data', file => {
          running++;
          buildCurriculum(file, curriculum, langArr[i]).then(done);
        })
        .on('end', done);
    }
    readDir();
  });
};

async function buildCurriculum(file, curriculum, lang) {
  const { name, depth, path: filePath, fullPath, stat } = file;
  if (depth === 1 && stat.isDirectory()) {
    // extract the superBlock info
    const { order, name: superBlock } = superBlockInfo(name);

    if (lang === 'english') {
      curriculum[superBlock] = { superBlock, order, blocks: {} };
    }
    return;
  }
  if (depth === 2 && stat.isDirectory()) {
    const blockName = getBlockNameFromPath(filePath);
    const metaPath = path.resolve(
      __dirname,
      `./challenges/_meta/${blockName}/meta.json`
    );
    const blockMeta = require(metaPath);
    const { name: superBlock } = superBlockInfoFromPath(filePath);
    let blockInfo;
    if (lang === 'english') {
      blockInfo = { meta: blockMeta, challenges: [] };
    } else {
      blockInfo = {
        meta: blockMeta,
        challenges: curriculum[superBlock].blocks[name].challenges
      };
      blockInfo['challenges_' + lang] = [];
    }
    curriculum[superBlock].blocks[name] = blockInfo;
    return;
  }
  if (name === 'meta.json' || name === '.DS_Store') {
    return;
  }

  const block = getBlockNameFromPath(filePath);
  const { name: superBlock } = superBlockInfoFromPath(filePath);
  let challengeBlock;
  try {
    challengeBlock = curriculum[superBlock].blocks[block];
  } catch (e) {
    console.log(superBlock, block);
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  }
  const { meta } = challengeBlock;

  const challenge = await createChallenge(fullPath, meta, lang);

  if (lang === 'english') {
    challengeBlock.challenges = [...challengeBlock.challenges, challenge];
  } else {
    challengeBlock['challenges_' + lang] = [
      ...challengeBlock['challenges_' + lang],
      challenge
    ];
  }
}

async function createChallenge(fullPath, maybeMeta, lang) {
  let meta;
  if (maybeMeta) {
    meta = maybeMeta;
  } else {
    const metaPath = path.resolve(
      metaDir,
      `./${getBlockNameFromFullPath(fullPath)}/meta.json`
    );
    meta = require(metaPath);
  }
  const { name: superBlock } = superBlockInfoFromFullPath(fullPath);
  const challenge = await parseMarkdown(fullPath);
  const challengeOrder = findIndex(
    meta.challengeOrder,
    ([id]) => id === challenge.id
  );
  const {
    name: blockName,
    order,
    superOrder,
    isPrivate,
    required = [],
    template,
    time
  } = meta;

  challenge.lang = lang;
  challenge.id = (lang !== 'english' ? lang : '') + challenge.id;
  challenge.block = blockName;
  challenge.dashedName = dasherize(challenge.title);
  challenge.order = order;
  challenge.superOrder = superOrder;
  challenge.superBlock = superBlock;
  challenge.challengeOrder = challengeOrder;
  challenge.isPrivate = challenge.isPrivate || isPrivate;
  challenge.required = required.concat(challenge.required || []);
  challenge.template = template;
  challenge.time = time;

  return challenge;
}

exports.createChallenge = createChallenge;

function superBlockInfoFromPath(filePath) {
  const [maybeSuper] = filePath.split(path.sep);
  return superBlockInfo(maybeSuper);
}

function superBlockInfoFromFullPath(fullFilePath) {
  const [, , maybeSuper] = fullFilePath.split(path.sep).reverse();
  return superBlockInfo(maybeSuper);
}

function superBlockInfo(fileName) {
  const [maybeOrder, ...superBlock] = fileName.split('-');
  let order = parseInt(maybeOrder, 10);
  if (isNaN(order)) {
    return { order: 0, name: fileName };
  } else {
    return {
      order: order,
      name: superBlock.join('-')
    };
  }
}

function getBlockNameFromPath(filePath) {
  const [, block] = filePath.split(path.sep);
  return block;
}

function getBlockNameFromFullPath(fullFilePath) {
  const [, block] = fullFilePath.split(path.sep).reverse();
  return block;
}
