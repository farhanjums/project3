const express = require("express");
const router = express.Router();
var path = require('path')


router.use(express.static("views"));


router.get('/home',(req,res) => {

    res.render("../views/home");
})

router.get('/Log-In',(req,res) => {

    res.render("../views/Log-In");
})

router.get('/feedback',(req,res) => {

    res.render("../views/Feedback");
})


module.exports = router;

