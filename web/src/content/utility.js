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
export { semester_sort, group_sem };
