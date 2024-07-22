const passport = require('passport');
const LocalStategy = require('passport-local').Strategy

function init(){

    authUser = (user, password, done) => {
        console.log(`Value of "User" in authUser function ----> ${user}`)         //passport will populate, user = req.body.username
        console.log(`Value of "Password" in authUser function ----> ${password}`) //passport will popuplate, password = req.body.password
    
    // Use the "user" and "password" to search the DB and match user/password to authenticate the user
    // 1. If the user not found, done (null, false)
    // 2. If the password does not match, done (null, false)
    // 3. If user found and password match, done (null, user)
        
        let authenticated_user = { id: 1, user:user} 
    //Let's assume that DB search that user found and password matched for Kyle
        
        return done (null, authenticated_user ) 
    }

    passport.use(new LocalStategy(authUser))
    passport.serializeUser( (user, done) => { 
        console.log(`--------> Serialize User`)
        console.log(user)     
    
        done(null, user.id)
    });
    passport.deserializeUser((user, done) => {
        console.log("---------> Deserialize Id")
        console.log(user)

        done (null, user )  
    passport.authenticate('local');
}) ;
}

module.exports= init;