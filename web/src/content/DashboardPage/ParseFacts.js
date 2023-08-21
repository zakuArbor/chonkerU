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
        console.log(prog);
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
  console.log(progs);
  return progs;
}

export { getGenderProgram, getOverallGender, getProgramCount, getProgYear, getGenderYear, getProgGenderYear, getProgs };
