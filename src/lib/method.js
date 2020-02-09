exports.asyncForeach = async (array, callback) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < array.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[i]);
  }
};
