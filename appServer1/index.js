const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 8081;
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");
const https = require('https');
const secret = require('./secret1.js');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/app", require("./routes/appRoute"));

/*
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
*/

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
    sslServer.listen(443,()=>console.log('Running on Port 443'));

  }
  
  asyncCaller(app);