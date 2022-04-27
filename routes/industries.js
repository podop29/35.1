const express= require('express');
const db = require('../db');
const router = new express.Router();

router.get('/', async (req,res,next)=>{
    try{

        results = await db.query(`
            SELECT i.code, i.industry, c.code
            FROM industries as i
            LEFT JOIN industries_companies as ic 
            ON i.code = ic.ind_code
            LEFT JOIN companies as c
            ON ic.comp_Code = c.code
            `)
        return res.json({industries: results.rows})


    }catch(e){
        return next(e)
    }
})



module.exports = router;
