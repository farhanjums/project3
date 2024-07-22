const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 8081;
const app = express();
const ejs = require('ejs');
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use("/app", require("./routes/appRoute"));


app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
