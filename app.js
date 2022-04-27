/** BizTime express application. */


const express = require("express");

const app = express();
const ExpressError = require("./expressError")



app.use(express.json());
app.use(express.urlencoded({extended: true}))


const companyRouters = require('./routes/companies')
const invoiceRouter = require('./routes/invoices')
const industriesRouter = require('./routes/industries')


app.use('/companies', companyRouters)
app.use('/invoices', invoiceRouter)
app.use('/industries', industriesRouter)




/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


module.exports = app;
