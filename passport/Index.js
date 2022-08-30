const passport = require('passport');
const google = require('./googleStrategy');
const Users = require("../d_schemas/user") 

module.exports = () => {
   
   
   passport.serializeUser((data, done) => {
      done(null, data);
   });
 
   // serialize 한 후 deserializeUser로 넘겨줌 
   passport.deserializeUser((data, done) => {
      console.log("data", data)
      Users.findOne({ googleId: data.user.googleId })
         .then(user => {
            done(null, user)
         })
         .catch(err => done(err));
   }); 
 
   google();
};