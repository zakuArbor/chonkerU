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

let gen_link = (link) => {
  return "cu-visualizer".concat(link === "/" ? "" : link);
};

export { semester_sort, gen_link };
