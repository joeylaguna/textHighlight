export const phrases = {
  'grey': ['very unlikely to leave', 'will deliver new'],
  'purple': ['do not cross', 'log file', 'our team', 'radio'],
  'blue': ['an adorable puppy', 'aggressive', 'arm', 'very unlikely'],
  'green': ['adorable', 'creative', 'love', 'new technology', 'groundbreaking'],
  'red': ['action-oriented', 'alarming', 'candidates', 'leave', 'do not want']  
}

export function formatDoc(doc){
  let docArray = doc.trim().split(' ');
  for (let i = 0; i < docArray.length; i++) {
    let endOfSentence = false;
    let currentWord = docArray[i];
    if (docArray[i][docArray[i].length -1] === '.' || docArray[i][docArray[i].length -1] === '!' || docArray[i][docArray[i].length -1] === '?' ) {
      endOfSentence = true;
    }
    let phrase = currentWord.toLowerCase().replace( /[^a-zA-Z ]/g, '').replace( /\s\s+/g, ' ' );
    docArray[i] = {};
    docArray[i]['phrase'] = currentWord;
    docArray[i].formatPhrases = phrase;
    docArray[i].endOfSentence = endOfSentence;
    docArray[i].classes = [];
    docArray[i].index = doc.indexOf(currentWord);
  }
  return docArray;
}

export function findPhraseMatches(phrase, doc, docArray){
  return doc.toLowerCase().indexOf(phrase);
}

export function findPhraseOccurances(doc, docArray){
  let occurances = [];
  for (let key in phrases) {
    let color = key;
    for (let i = 0; i < phrases[color].length; i++) {
      let match = findPhraseMatches(phrases[color][i], doc, docArray);
      if (match !== -1) {
        occurances.push({'phrase': phrases[color][i], 'color': color});
      }
    }
  }
  return occurances;
}

export function addMultipleClasses (docArray, docArrayIndex, occurances, occurancesIndex){
  let occurancePhrase = occurances[occurancesIndex];
  let occurancePhraseLength = occurancePhrase.phrase.split(' ').length;
  let docArrayPhraseArray = docArray.slice(docArrayIndex, docArrayIndex + occurancePhraseLength);
  let docArrayPhraseString = [];

  for (let i = 0; i < docArrayPhraseArray.length; i++) {
    docArrayPhraseString.push(docArrayPhraseArray[i].formatPhrases);
  }

  if (occurancePhrase.phrase === docArrayPhraseString.join(' ')) {
    return occurances[occurancesIndex].color;
  }
}

export function addClasses(docArray, occurances){
  for (let i = 0; i < docArray.length; i++) {
    for (let j = 0; j < occurances.length; j++) {
      if (docArray[i].formatPhrases === occurances[j].phrase.split(' ')[0] || docArray[i].phrase === occurances[j].phrase.split(' ')[0]) {
        if (occurances[j].phrase.split(' ').length > 1) {
          docArray[i].classes.push(addMultipleClasses(docArray, i, occurances, j));
        } else {
          docArray[i].classes.push(occurances[j].color);
        }
      }
    }
  }
}

export function buildMultipleClasses(docArray, docArrayIndex, currentOccurance) {
  let classIndexList = [];
  const currentOccuranceLength = currentOccurance.phrase.split(' ').length;
  const slicedArray = docArray.slice(docArrayIndex, docArrayIndex + currentOccuranceLength);
  const slicedArrayLength = slicedArray.length;
  let docArrayString = [];

  for (let i = 0; i < slicedArray.length; i++) {
    docArrayString.push(slicedArray[i].formatPhrases);
  }
  docArrayString = docArrayString.join(' ');
  
  if (currentOccurance.phrase === docArrayString) {
    for (let i = 0; i < slicedArrayLength; i++ ) {
      let classIndex = {};
      classIndex.index = docArrayIndex + i;
      classIndex.classes = [currentOccurance.color];
      //add edges
      if (i === 0 && slicedArrayLength === 1) {
        classIndex.classes.push('leftEdge rightEdge')
      } else if (i === 0 && slicedArrayLength > 1) {
        classIndex.classes.push('leftEdge')
      } else if (i === slicedArrayLength - 1) {
        classIndex.classes.push('rightEdge')
      }
      classIndex.trailingWords = [];
      for (let j = 0; j < currentOccuranceLength; j++) {
        classIndex.trailingWords.push(docArrayIndex + j)
      }
      classIndexList.push(classIndex);
    }
  }
  return classIndexList
}

export function buildClassList(occurances, docArray){
  let classIndexList = {};

  for (let i = 0; i < occurances.length; i++) {
    let currentOccurance = occurances[i];
    for (let j = 0; j < docArray.length; j++) {
      let currentWord = docArray[j];
      if (currentWord.formatPhrases === currentOccurance.phrase.split(' ')[0] || currentWord.phrase === currentOccurance.phrase.split(' '[0])) {
        if (currentOccurance.phrase.split(' ').length > 1) {
          let classIndexTempList = buildMultipleClasses(docArray, j, currentOccurance);
          if (classIndexTempList) {
            for (let x = 0; x < classIndexTempList.length; x++) {
              let currentClassIndex = classIndexTempList[x];
              if (classIndexList[currentClassIndex.index]) {
                let temp = classIndexList[currentClassIndex.index]['classes'].concat(currentClassIndex.classes);
                classIndexList[currentClassIndex.index]['classes'] = temp;
                classIndexList[currentClassIndex.index]['trailingWords'] = currentClassIndex.trailingWords
              } else {     
                classIndexList[currentClassIndex.index] = {};
                classIndexList[currentClassIndex.index]['classes'] = currentClassIndex.classes;
                classIndexList[currentClassIndex.index]['trailingWords'] = currentClassIndex.trailingWords || [];
              } 
            }
          }  
        } else {
          if (classIndexList[j]) {
            classIndexList[j]['classes'].concat(currentOccurance.color);
          } else {
            classIndexList[j] = {};
            classIndexList[j]['classes'] = [currentOccurance.color]
            classIndexList[j]['trailingWords'] = [];
          }
        }
      }
    }
  }
  return classIndexList
}

export function addClassesToWords(docArray, classes){
  for (let i = 0; i < docArray.length; i++) {
    if (classes[i]) {
      docArray[i].classes = classes[i]
    } else {
      docArray[i].classes = {};
      docArray[i].classes['classes'] = [];
      docArray[i].classes['trailingWords'] = [];
    }
  }
  return docArray
}

export function buildPhraseDataList(docArray, occurances) {
  let phraseData = [];
  for (let i = 0; i < occurances.length; i++) {
    phraseData.push()
  }
}

export function addHoverClasses(docArray, hoverItems, key) {
  let classToAdd = docArray[key].classes.classes[docArray[key].classes.classes.length-1];
  if (classToAdd === 'leftEdge' || classToAdd === 'rightEdge') {
    classToAdd = docArray[key].classes.classes[docArray[key].classes.classes.length-2];
  }
  if (hoverItems.length === 0) {
    docArray[key].classes.classes.unshift('active-'+classToAdd);
    return docArray
  }
  for (let i = 0; i < hoverItems.length; i++) {
    let index = hoverItems[i];
    if (docArray[index].classes.classes.indexOf('active-'+classToAdd) === -1) {
      docArray[index].classes.classes.unshift('active-'+classToAdd);
    }
  }
  return docArray;
}

export function removeHoverClasses(docArray, hoverItems, key) {
  if (hoverItems.length === 0) {
    docArray[key].classes.classes.shift();
    return docArray;
  }
  for (let i = 0; i < hoverItems.length; i++) {
    let currentWord = docArray[hoverItems[i]];
    currentWord.classes.classes.shift();
  }
  return docArray
}

export function testFun(indexMap, docArray, doc) {
  for (let color in phrases) {
    for (let i = 0; i < phrases[color].length; i++) {
      let phrase = phrases[color][i];
      let phraseArray = phrase.split(' ');
      let prevFound = false;
      for (let j = 0; j <phraseArray.length; j++) {
        if (j !== 0) {
          if (prevFound) {
            if (doc.indexOf(phraseArray[j]) !== -1) {
              let temp = doc.indexOf(phraseArray[j]);
              let word = docArray[indexMap[temp]];
              word.classes.push(color);
              prevFound = true;
            }
          }
        } else {
          let re = new RegExp('\\b' + phraseArray[j] + '\\b');
          let test = doc.search(re);
          if (doc.search(re) !== -1) {
            let temp = doc.search(phraseArray[j]);
            let word = docArray[indexMap[temp]];
            word.classes.push(color);
            prevFound = true;
          }
        }
      }
    }
  }
  return (docArray);
}

export function buildIndexMap(docArray) {
  let indexMap = {};
  for (let i = 0; i < docArray.length; i++) {
    indexMap[docArray[i].index] = i;
  }
  return indexMap
}


export function highlightText(doc){
  let docArray = formatDoc(doc);
  const indexMap = buildIndexMap(docArray);
  //return testFun(indexMap, docArray, doc);
  const occurances = findPhraseOccurances(doc, docArray);
  const classes = buildClassList(occurances, docArray);
  docArray = addClassesToWords(docArray, classes);
  return docArray;
}

export function hoverActive(docArray, hoverItems, key) {
  return addHoverClasses(docArray, hoverItems, key);
}

export function hoverInactive(docArray, hoverItems, key) {
  return removeHoverClasses(docArray, hoverItems, key);
}

highlightText('you will deliver new technology')