const express = require('express');
const router = express.Router();

router.get('/', async(req,res,next)=>{
    try{
        res.render();
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/', async(req,res,next)=>{
    const A = req.body;
    try{
        db.create({});
        res.redirect('/');

    }catch(err){
        console.error(err);
        next(err);
    }
})

