const express= require('express');
const db = require('../db');
const router = new express.Router();
const ExpressError = require('../expressError')

router.get('/',async (req,res,next)=>{
    try{
        const results = await db.query(`SELECT * FROM invoices`)
        return res.json({invoices: [results.rows]})

    }catch(e){
        return next(e)
    }
})

router.get('/:id',async (req,res,next)=>{
    try{
        const {id} = req.params
        const results = await db.query(`SELECT * FROM invoices where id=$1`, [id])
        
        return res.json({invoices: [results.rows]})
        
    }catch(e){
        return next(e)
    }
})

router.post("/", async function (req, res, next) {
    try {
      let {comp_code, amt} = req.body;
  
      const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
             VALUES ($1, $2) 
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
          [comp_code, amt]);
  
      return res.json({"invoice": result.rows[0]});
    }
  
    catch (err) {
      return next(err);
    }
  });


  router.patch('/:id',async (req,res,next)=>{
    try{
        const {id} = req.params
        const {amt, paid} = req.body;
        let paidDate = null;

        const currentResult = await db.query(`SELECT paid FROM invoices WHERE id=$1`, [id])
        if(currentResult.rows.length === 0){
            throw new ExpressError("Invoice cant be found", 404)
        }

        const currentPaidDate = currentResult.rows[0].paid_date;

        if (!currentPaidDate && paid) {
            paidDate = new Date();
          } else if (!paid) {
            paidDate = null
          } else {
            paidDate = currentPaidDate;
          }
      
    
          const result = await db.query(
            `UPDATE invoices
             SET amt=$1, paid=$2, paid_date=$3
             WHERE id=$4
             RETURNING id, comp_code, amt, paid, add_date, paid_date`,
          [amt, paid, paidDate, id]);
        
       

        return res.json({invoices: [results.rows[0]]})
    }catch(e){
        return next(e)
    }
})


router.delete('/:id',async (req,res,next)=>{
    try{
        const {id} = req.params
        const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id])

        return res.json({msg: "DELETED"})
    }catch(e){
        return next(e)
    }
})



module.exports = router;