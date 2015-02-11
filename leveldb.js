var levelup = require('levelup'),
  _db = levelup('./mydb', function (err, db) {
    if (err) return console.log('Ooops!', err);
    console.log('Connected to levelDB database', db.location)
  });

exports.connect = function () {
  return _db;
};
