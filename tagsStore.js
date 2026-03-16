const tagsDB = [];

module.exports = {
  add: (record) => tagsDB.push(record),
  getAll: () => tagsDB
};
