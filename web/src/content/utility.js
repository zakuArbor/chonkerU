/*
Sorts courses by epoch time, not the most accurate but assuming source data is released on timely manner
*/
let semester_sort = (x, y) => {
  if (x.epoch < y.epoch) {
    return -1;
  }
  if (x.epoch > y.epoch) {
    return 1;
  }
  return 0;
};

let term_sort = (term1, term2) => {
  if (term1 == "W") {
    return 1;
  }
  if (term1 == "S") {
    if (term2 == "F") {
      return 1;
    }
    if (term2 == "W") {
      return -1;
    }
  }
  return 0;
}

/*
Sorts courses if given YYYY-T strings
*/
let semester_sort3 = (x, y) => {
  if (x.length < 6 && y.length < 6) {
    return 0;
  }

  const year1 = x.substr(0,4);
  const year2 = y.substr(0,4);
  
  const term1 = x[5];
  const term2 = y[5];

  if (year1 < year2) {
    return -1;
  }
  if (year1 > year2) {
    return 1;
  }

  return term_sort(term1, term2);
};

/*
Sorts courses by semester and year 
*/
let semester_sort2 = (x, y) => {
  const year1 = parseInt(x.year);
  const year2 = parseInt(y.year);

  if (year1 < year2) {
    return -1;
  }
  else if (year1 > year2) {
    return 1;
  }

  return term_sort(x.sem, y.sem);
};

/*
Returns the semester grouping given a semester
Input: length 6: YYYY-T (i.e. 2019-F)
Realistically 100 years will not pass and will only be considering courses taken from 2010-2030
i.e.
2018-S => "Summer '18"
2018-F => "Fall-Winter '18-'19"
2019-W => "Fall-Winter '18-'19"
*/
let group_sem = (sem) => {
  if (sem.length !=6) {
    return sem
  }
  const term = sem.slice(-1).toUpperCase();
  const year = sem.substring(2,4);
  console.log(sem);
  console.log(year);
  switch (term) {
    case 'F':
      return "F-W '" + year + "-'" + (parseInt(year) + 1).toString();
    case 'W':
      return "F-W '" + (parseInt(year) - 1).toString() + "-'" + year;
    default:
      break;
  }
  return "Summer '" + year;
};
export { semester_sort, semester_sort2, semester_sort3, group_sem };
