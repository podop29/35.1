process.env.NODE_ENV = "test";
const request = require('supertest')
const app = require('./app');
const db = require('./db')


let testCompany;
beforeEach(async()=>{
    const result = await db.query(`INSERT INTO companies (code,name, description)
    VALUES('better','BetterHealth','healthy food store') RETURNING *`)
    testCompany = result.rows[0]
})

afterEach(async ()=>{
    await db.query('DELETE FROM companies')
})

afterAll(async()=>{
    await db.end()
})



describe("Get /companies", ()=>{
    test("get list of companies", async ()=>{
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({companies:[testCompany]})
    })
})

describe("POST /companies", ()=>{
    test("Creates a new company", async()=>{
        const res = await request(app).post('/companies').send({code: 'micro', name:'microsoft',description:"Hardware and software" });
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            companies: {code: 'micro',name:'microsoft', description:'Hardware and software'}
        })
    })
})


describe("DELETE /companies/:code", function() {
    test("Deletes a single company", async function() {
      const response = await request(app)
        .delete(`/companies/${testCompany.code}`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ msg: "DELETED" });
    });
  });
  
  