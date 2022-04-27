const express= require('express');
const db = require('../db');
const slugify = require('slugify')
const router = new express.Router();

router.get('/',async (req,res,next)=>{
    try{
        const results = await db.query(`SELECT * FROM companies`)
        return res.json({companies: results.rows})

    }catch(e){
        return next(e)
    }
})

router.get('/:code',async (req,res,next)=>{
    try{
        const {code} = req.params
        const results = await db.query(`SELECT * FROM companies where code=$1`, [code])
        if(results){
            return res.json({companies: [results.rows]})
        }else{
            return res.status(404).json({companies: `Error ${code} is not a code`})
        }

    }catch(e){
        return next(e)
    }
})


router.post('/', async (req,res,next)=>{
    try{
        const {name, description} = req.body
        const code = slugify(name)
        const results = await db.query(`INSERT INTO companies (code,name, description)
        VALUES($1,$2,$3) RETURNING *`, [code,name,description])
        return res.status(201).json({companies: results.rows[0]})

    }catch(e){
        return next(e)
    }
})




router.patch('/:code',async (req,res,next)=>{
    try{
        const {code} = req.params
        const {name,description} = req.body;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2
        WHERE code=$3 RETURNING *`, [name,description,code])

        return res.json({companies: [results.rows[0]]})
    }catch(e){
        return next(e)
    }
})


router.delete('/:code',async (req,res,next)=>{
    try{
        const {code} = req.params
        const results = await db.query(`DELETE FROM companies WHERE code=$1`, [code])

        return res.json({msg: "DELETED"})
    }catch(e){
        return next(e)
    }
})



module.exports = router;