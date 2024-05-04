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
        'honours': data['honor'].num,
        'major': data['major'].num,
        'minor': data['minor'].num
    }
    return Object.keys(prog).map(type => { return { 'group': type, 'value': prog[type] } });
}

const getGradMinor = (data) => {
  //only applies to math majors/honors
    let minors = [];
    Object.keys(data['honor']['minor']).map(minor => minors.push({ 'group': 'honour', 'key': minor, 'value': data['honor']['minor'][minor]}));
    Object.keys(data['major']['minor']).map(minor => minors.push({ 'group': 'major', 'key': minor, 'value': data['major']['minor'][minor]}));
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
  types.forEach(type => {distinctions.push({ 'group': type, 'key': 'Distinction', 'value': data[type]['d']})});
  types.forEach(type => distinctions.push({ 'group': type, 'key': 'High Distinction', 'value': data[type]['hd']}));
  types.forEach(type => distinctions.push({ 'group': type, 'key': 'NA', 'value': data[type]['num'] - data[type]['d'] - data[type]['hd']}));
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
