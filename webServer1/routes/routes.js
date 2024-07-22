const express = require("express");
const router = express.Router();
var path = require('path');
const bodyParser = require("body-parser");
let multer = require('multer');
let upload = multer();
let fetch = require('node-fetch');
let bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const dotenv = require("dotenv").config();




router.use(express.static("views"));
router.use(express.json());
router.use(bodyParser.urlencoded({extended:true}));


router.get('/home',(req,res) => {
    if(req.isAuthenticated()){
    console.log(JSON.stringify(req.isAuthenticated()));
    res.render("../views/home",{user:req.user.username, auth:JSON.stringify(req.isAuthenticated())});
    }
    else{
        res.render("../views/home",{user:null,auth:null});
    }
});



router.get('/Log-In',(req,res) => {

    res.render("../views/Log-In",{e:null});
})


router.get('/register',(req,res) => {

    res.render("../views/register",{sqlMessage:null});
    
})



router.get('/feedback',(req,res) => {

    res.render("../views/Feedback");
})

router.get('/sucess',(req,res) => {

    res.render("../views/sucess");
})

router.get('/chart',(req,res) => {

    res.render("../views/chart");
})

router.get('/chart2',(req,res) => {

    res.render("../views/chart2");
})

router.get('/chart3',(req,res) => {

    res.render("../views/chart3");
})

router.get('/holdOn',(req,res) => {

    res.render("../views/HoldOn");
})


router.get('/health',(req,res) => {

  res.status(200).send(" Health check success");
});


router.get('/LogOut', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/api/Log-In');
    });
  });

router.post('/submit',upload.fields([]),(req,res) => {

    const body = req.body;
    var res1='';

    let data1="";
    const test = fetch(process.env.WEB_SERVER_LB, {
	method: 'post',
	body: JSON.stringify(body),
	headers: {'Content-Type': 'application/json'}
    })  .then(function (a) {
        return a.json(); // call the json method on the response to get JSON
    })
        .then(function (json) {
        console.log("AppServer: " + json.apiMessage);

        if (json.apiMessage == "done"){
            res.status(200);
            res.redirect('/api/sucess');
        }
        
    })

});

router.post('/register',upload.fields([]),async(req,res) => {

    try{
    const body = req.body;
    var res1='';

    let data1="";
    body.password = await bcrypt.hash(req.body.password,10);
    console.log(body);
    
    console.log(process.env.APP_SERVER_LB+"/app/register");
    const test = fetch(process.env.APP_SERVER_LB+"/app/register", {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
        })  .then(function (a) {
            return a.json(); // call the json method on the response to get JSON
        })
            .then(function (json) {
            console.log("AppServer: " + json.apiMessage);
    
            if (json.apiMessage == "done"){
                res.status(200);
                res.redirect('/api/sucess');
            }
            if (json.apiMessage == "fail" && json.code == "ER_DUP_ENTRY"){
                console.log("AppServer: " + json.sqlMessage);
                res.render("../views/register",{sqlMessage:"Account Exist. Please Log in"});
            }
            
        })
    }
    catch{
        res.redirect('/api/register');
    }


});

/*
router.post('/login',async(req,res)=> {
    try{
        console.log('FROM POST METHOD ---> '+req.body.username);
        console.log('FROM POST METHOD ---> '+req.body.password);
        res.status(200).json({
            timestamp: Date.now(),
            msg: 'Succesfull Log in',
            code: 200,
        });
    } catch(err){
        throw new Error(err);
    };
});
*/

router.post('/login',
        (req,res,next) => {
            console.log('1. LOGIN HANDLER --> ' + JSON.stringify(req.body))
            passport.authenticate(
                'local', 
                (err , user ) => {
                    console.log('3. PASSPORT AUTHENTICATE CALL BACK ---> '+ JSON.stringify(user));

                    if (err){
                        //handle error
                        console.log(err);
                        return res.status(401).render("../views/Log-In",{e:err});
                    }

                    if (!user){
                        //Handle no USER request
                        res.render("../views/Log-In",{e:err})
                        return res.status(401).render("../views/Log-In",{e:err});
                    }

                    req.logIn(user,(err) => {
                        if (err){
                            return next(err);
                        }
                        res.status(200);
                        res.redirect('/api/home');

                    })

            }
        )(req,res,next)
     }
);




module.exports = router;

