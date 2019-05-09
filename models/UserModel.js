/**
 * User Model
 * 
 * By: Oded Cnaan
 * April 2019
 */
var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  token : {
    type: String,
  },
  last_login : {
    type : Date
  }
});
UserSchema.set('collection', 'users');

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  UserModel.findOne({
    email: email 
  })
  .then(user => {
    if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      callback(err);
      return;
    }

    bcrypt.compare(password, user.password, function (err, isMatched) {
      if (err) callback(err, null);
      if (!isMatched) {
        callback(new Error("User not match"), null);
        return;
      }
     
      // confidential data should not be sent to client
      var userJson = user.toJSON()
      delete userJson.password

      callback(null, userJson);
    });
  })
  .catch(() => {
  })
}

var UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel;