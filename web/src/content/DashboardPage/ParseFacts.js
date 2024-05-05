const getGenderProgram = (data, prog) => {
    if (!(prog in data)) {
        return []
    }
    let gender = {
        'male': 0,
        'female': 0,
        'other': 0
    }
    data[prog].forEach((year) => {
        gender.male += year.male;
        gender.female += year.female;
        gender.other += year.other;
    });
    return Object.keys(gender).map(type => { return { 'group': type, 'value': gender[type] } });
}

const checkValidData = (data) => {
    if (!('honours' in data && 'general' in data)) {
        return false;
    }
    return true;
};

const getOverallGender = (data) => {
    if (!('honours' in data && 'general' in data)) {
        return []
    }
    let gender = {
        'male': 0,
        'female': 0,
        'other': 0
    }
    const programs = ['honours', 'general'];
    for (let i = 0; i < programs.length; i++) {
        let prog = programs[i];
        data[prog].forEach((year) => {
            gender.male += year.male;
            gender.female += year.female;
            gender.other += year.other;
        });
    };
    return Object.keys(gender).map(type => { return { 'group': type, 'value': gender[type] } });
}

const getProgramCount = (data) => {
    if (!checkValidData(data)) {
        return []
    }
    let count = {
        'honours': 0,
        'general': 0
    }
    const programs = ['honours', 'general'];
    for (let i = 0; i < programs.length; i++) {
        let prog = programs[i];
        data[prog].forEach((year) => {
            count[prog] += year.male;
            count[prog] += year.female;
            count[prog] += year.other;
        });
    };
    return Object.keys(count).map(type => { return { 'group': type, 'value': count[type] } });
}

const getProgYear = (data) => {
    if (!checkValidData(data)) {
        return [];
    }
    let yearData = [];
    const programs = ['honours', 'general'];
    for (let i = 0; i < programs.length; i++) {
        let prog = programs[i];
        data[prog].forEach((year) => {
            yearData.push({
                'group': prog,
                'key': "year " + year['year'],
                'value': year.male + year.female + year.other
            });
        });
    }
    return yearData;
};

const getGenderYear = (data) => {
    if (!checkValidData(data)) {
        return [];
    }
    let yearData = [];
    const programs = ['honours', 'general'];
    const gender = ['male', 'female', 'other'];
    for (let i = 0; i < programs.length; i++) {
        let prog = programs[i];
        data[prog].forEach((year) => {
            gender.forEach((type) => {
                yearData.push({
                    'group': type,
                    'key': "year " + year['year'],
                    'value': year[type]
                });
            });
        });
    }
    return yearData;
};

const getProgGenderYear = (data, prog) => {
    if (!(prog in data)) {
        return [];
    }
    let yearData = [];
    const gender = ['male', 'female', 'other'];
    
    data[prog].forEach((year) => {
        gender.forEach((type) => {
            yearData.push({
                'group': type,
                'key': "year " + year['year'],
                'value': year[type]
            });
        });
    });
    
    return yearData;
};

const getProgs = (data) => {
  let progs = []
  for (const key of Object.keys(data)) {
    for (const prog of data[key]) {
      progs.push({
        group: prog.name,
        key: key,
        value: prog.value
      });
    }
  }
  return progs;
}

const getResidency = (data, prog) => {
  let res = []
  for (const type of Object.keys(data[prog])) {
    res.push({
      group: type,
      value: data[prog][type]
    })
  }
  return res;
}

const getOverallResidency = (data) => {
  let res = {
    'canadian': 0,
    'PR': 0,
    'international': 0
  };
  const programs = ['honours', 'general'];
  for (let i = 0; i < programs.length; i++) {
    let prog = data[programs[i]];
      console.log(prog);
      res.canadian += prog.canadian;
      res.PR += prog.PR;
      res.international += prog.international;
    }
    return Object.keys(res).map(type => { return { 'group': type, 'value': res[type] } });
}

const getGradProg = (data) => {
  console.log(data);
    let prog = {
        'Math Hon.': data['honor']['Mathematics'].num,
        'Math Gen.': data['major']['Mathematics'].num,
        'Stat Hon.': data['honor']['Statistics'].num,
        'Stat Gen.': data['major']['Statistics'].num,
        'minor': data['minor'].num
    }
    return Object.keys(prog).map(type => { return { 'group': type, 'value': prog[type] } });
}

const getGradMinor = (data) => {
  //only applies to math majors/honors
    let minors = [];
    Object.keys(data['honor']['Mathematics']['minor']).map(minor => minors.push({ 'group': 'Math Hon.', 'key': minor, 'value': data['honor']['Mathematics']['minor'][minor]}));
    Object.keys(data['honor']['Statistics']['minor']).map(minor => minors.push({ 'group': 'Stats Hon.', 'key': minor, 'value': data['honor']['Statistics']['minor'][minor]}));
    Object.keys(data['major']['Mathematics']['minor']).map(minor => minors.push({ 'group': 'Math Gen.', 'key': minor, 'value': data['major']['Mathematics']['minor'][minor]}));
    Object.keys(data['major']['Statistics']['minor']).map(minor => minors.push({ 'group': 'Stats Gen.', 'key': minor, 'value': data['major']['Statistics']['minor'][minor]}));

    return minors;
};

const getGradMajor = (data) => {
  //only applies to math minors
    let majors = [];
    Object.keys(data['minor']['major']).map(major => majors.push({ 'group': 'major', 'key': major, 'value': data['minor']['major'][major]}));
    return majors;
};

const getGradDistinction = (data) => {
  let distinctions = [];
  let types = ['honor', 'major', 'minor'];
  let progs = ['Mathematics', 'Statistics']
  distinctions.push({ 'group': "Math-" + "Hon.", 'key': 'Distinction', 'value': data['honor']['Mathematics']['d']});
  distinctions.push({ 'group': "Stats-" + "Hon.", 'key': 'Distinction', 'value': data['honor']['Statistics']['d']});
  distinctions.push({ 'group': "Math-" + "Gen.", 'key': 'Distinction', 'value': data['major']['Mathematics']['d']});
  distinctions.push({ 'group': "Stats-" + "Gen.", 'key': 'Distinction', 'value': data['major']['Statistics']['d']});
  distinctions.push({ 'group': "Minor", 'key': 'Distinction', 'value': data['minor']['d']});

  distinctions.push({ 'group': "Math-" + "Hon.", 'key': 'High Distinction', 'value': data['honor']['Mathematics']['hd']});
  distinctions.push({ 'group': "Stats-" + "Hon.", 'key': 'High Distinction', 'value': data['honor']['Statistics']['hd']});
  distinctions.push({ 'group': "Math-" + "Gen.", 'key': 'High Distinction', 'value': data['major']['Mathematics']['hd']});
  distinctions.push({ 'group': "Stats-" + "Gen.", 'key': 'High Distinction', 'value': data['major']['Statistics']['hd']});
  distinctions.push({ 'group': "Minor", 'key': 'High Distinction', 'value': data['minor']['hd']});
  
  var val = data['honor']['Mathematics'];
  distinctions.push({ 'group': "Math-" + "Hon.", 'key': 'NA', 'value': val['num'] - val['d'] - val['hd']});
  val = data['honor']['Statistics'];
  distinctions.push({ 'group': "Stats-" + "Hon.", 'key': 'NA', 'value': val['num'] - val['d'] - val['hd']});
  val = data['major']['Mathematics'];
  distinctions.push({ 'group': "Math-" + "Gen.", 'key': 'NA', 'value': val['num'] - val['d'] - val['hd']});
  val = data['major']['Statistics'];
  distinctions.push({ 'group': "Stats-" + "Gen.", 'key': 'NA', 'value': val['num'] - val['d'] - val['hd']});
  val = data['minor'];
  distinctions.push({ 'group': "Minor", 'key': 'NA', 'value': val['num'] - val['d'] - val['hd']});

  return distinctions;
}

export { 
  getGenderProgram, 
  getOverallGender, 
  getProgramCount, 
  getProgYear, 
  getGenderYear,
  getProgGenderYear,
  getProgs,
  getResidency,
  getOverallResidency,
  getGradProg,
  getGradMajor,
  getGradMinor,
  getGradDistinction,
};
