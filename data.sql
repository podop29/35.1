
\c biztime

DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS industries CASCADE;
DROP TABLE IF EXISTS industries_companies CASCADE;


CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries(
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE

);

CREATE TABLE industries_companies(
    id serial PRIMARY KEY,
    ind_code text REFERENCES industries,
    comp_code text REFERENCES companies
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries(code, industry)
Values('tech', 'technology'),
      ('ret', 'retail');

INSERT INTO industries_companies(ind_code,comp_code)
Values('tech', 'apple'),
      ('ret', 'ibm');



 SELECT m.id, m.msg, t.tag
        FROM messages AS m
        LEFT JOIN messages_tags as mt 
        ON m.id = mt.message_id
        LEFT JOIN tags AS t 
        ON mt.tag_code = t.code
        WHERE m.id = $1


SELECT i.code, i.industry, c.code
        FROM industries as i
        LEFT JOIN industries_companies as ic 
        ON i.code = ic.ind_code
        LEFT JOIN companies as c
        ON ic.comp_Code = c.code
        WHERE i.code = 'tech'