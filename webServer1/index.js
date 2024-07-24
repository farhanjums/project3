const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");
let fetch = require('node-fetch');
let bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStategy = require('passport-local').Strategy;
const https = require('https');
const secret = require('./secret1.js');

app.use(express.json());


app.set('view engine', 'ejs');
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((e,user,done) => {
    console.log('4. SERIALIZING USER: '+ JSON.stringify(user))
        if(user!==null){
            return done(null,user);
        }
        else {
            return done(e,false);
        }
})

passport.deserializeUser((e,user,done) => {
    console.log('5. DE-SERIALIZING USER: '+ JSON.stringify(user))
    console.log(process.env.APP_SERVER_LB+"/app/deserialize");


    console.log(JSON.stringify(user));
    const test = fetch(process.env.APP_SERVER_LB+"/app/deserialize", {
            method: 'post',
            body: JSON.stringify(user),
            headers: {'Content-Type': 'application/json'}
            })  .then(function (a) {
                return a.json() // call the json method on the response to get JSON
            })
                .then(function (json) {
                console.log("AppServer: " + json.apiMessage);
        
                if (json.apiMessage == "done"){
                    let userMain = {};
                    userMain.username = json.username
                    userMain.password = json.password;
                    console.log(userMain);
                    return done(null,{username: userMain.username , password: userMain.password});
                }
                else{
                    return done(e,false);
                }
                
            })
    
})




passport.use('local',new LocalStategy({passReqToCallback:true },
    async(req , username , password , done) => {
        console.log('2. LOCAL STRATEGY VERIFY CALL BACK---' + JSON.stringify(username));
        //this is where we call the db and validate
        try{
            const body = req.body;
            var res1='';
        
            let data1="";
            console.log(body);
            
            console.log(process.env.APP_SERVER_LB+"/app/login");
            const test = fetch(process.env.APP_SERVER_LB+"/app/login", {
                method: 'post',
                body: JSON.stringify(body),
                headers: {'Content-Type': 'application/json'}
                })  .then(function (a) {
                    return a.json(); // call the json method on the response to get JSON
                })
                    .then(async function (json) {
                    console.log("AppServer: " + json.apiMessage);
            
                    if (json.apiMessage == "done"){
                        console.log("BODY PASSWORD: "+password)
                        console.log("RESULT PASSWORD: "+json.password)
                        try{
                            if(await bcrypt.compare(body.password,json.password)){
                                console.log('COMPARE IS TRUE');
                                let user = {};
                                user.username=username;
                                user.password=json.password;

                                console.log("USER FOUND ---> "+ JSON.stringify(user) )
                                return done(null, {user})
                                //res.status(200);
                                //res.redirect('/api/home');
                            }
                            else{
                                var e = "Password is incorrect";
                                throw e;
                                
                            }
                        }
                        catch (e){
                            console.log("COMPARE IS FALSE---> "+e);
                            return done(e,false);
                            //res.render('../views/Log-In',{e:e});
                        }
        
                    }
                    if (json.apiMessage == "fail"){
                        console.log(json.sqlMessage);
                        var e = json.sqlMessage;
                        return done(e,false);
        
                        //res.render('../views/Log-In',{e:e});
        
        
                    }
                    
                })
                
        }
        catch(e){
                //res.redirect('/api/register');
                return done(e,false);
            }

    },
))



app.use("/api", require("./routes/routes"));


//app.listen(port,()=>{
    //console.log(`Server running on port ${port}`);
//});


async function s1() {
    return secret('farhan-key');
  }
  async function s2() {
    return secret('farhan-cert');
  }
  
  async function asyncCaller(app) {
    const result = await s1();
    const result2 = await s2();
    console.log(result);
    console.log(result2);


    const sslServer = https.createServer({
        key:  result,
        cert:  result2
    },app)
    sslServer.listen(3443,()=>console.log('Running on Port 3443'));

  }
  
  asyncCaller(app);
  

app.use(bodyParser.urlencoded({extended:true}));