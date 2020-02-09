const colors = require('colors');

exports.error = (...str) => {
  console.log(colors.red(str.join(' ')));
};

exports.green = (...str) => {
  console.log(colors.green(str.join(' ')));
};

exports.success = (...str) => {
  console.log(colors.green(str.join(' ')));
};

exports.warn = (...str) => {
  console.log(colors.yellow(str.join(' ')));
};

exports.point = (...str) => {
  console.log(colors.cyan(str.join(' ')));
};

exports.info = (...str) => {
  console.log(colors.gray(str.join(' ')));
};
