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
  }
  return docArray;
}

export function getPhraseOccurances(phrases, docArray){
  let phraseOccurances = [];
  for (let key in phrases) {
    let color = key;
    for (let i = 0; i < phrases[color].length; i++) {
      let currentPhrase = phrases[color][i];
      findPhraseOccurances(currentPhrase, docArray);
    }
  }
}

export function findPhraseMatches(phrase, doc, docArray){
  return doc.indexOf(phrase);
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
      if (docArray[i].formatPhrases === occurances[j].phrase.split(' ')[0]) {
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
      if (currentWord.formatPhrases === currentOccurance.phrase.split(' ')[0]) {
        if (currentOccurance.phrase.split(' ').length > 1) {
          let classIndexTempList = buildMultipleClasses(docArray, j, currentOccurance);
          if (classIndexTempList) {
            for (let x = 0; x < classIndexTempList.length; x++) {
              let currentClassIndex = classIndexTempList[x];
              if (classIndexList[currentClassIndex.index]) {
                let temp = classIndexList[currentClassIndex.index].concat(currentClassIndex.classes);
                classIndexList[currentClassIndex.index] = temp;
              } else {
                
                classIndexList[currentClassIndex.index] = currentClassIndex.classes;
              } 
            }
          }  
        } else {
          if (classIndexList[j]) {
            classIndexList[j].concat(currentOccurance.color);
          } else {
            classIndexList[j] = [currentOccurance.color]
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
    }
  }
  return docArray
}


export function highlightText(doc){
  let docArray = formatDoc(doc);
  const occurances = findPhraseOccurances(doc, docArray);
  const classes = buildClassList(occurances, docArray);
  docArray = addClassesToWords(docArray, classes);
  return docArray;
}