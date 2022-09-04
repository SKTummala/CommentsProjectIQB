const express = require("express");
const app = express();
app.use(express.json());
var cors = require("cors");
// Postgresql client
const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();
const _ = require("lodash");

//Postgresql connection pool
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.dbuser,
  host: process.env.dbhost,
  database: process.env.database,
  password: process.env.dbpassword,
  port: process.env.dbport
  // ssl: {     // required to connect to postgresql hosted on Heroku
  //   rejectUnauthorized: false,
  // }
});

app.use(cors());

// created pagination function, so that we can re-use for any non paginated data/result set .. it gives us the pagination information and returns only number of rows choosen
function paginationwithsearchandsort(data, reqparameters) {
  
  
  // reading request/query parameters which contains  user input actions like search keyword , order by , order type( Asc,desc) ..if there are no query parameters then use defualt values for API call)
  let { search, rowsperpage, page, orderby, orderbytype } = Object.keys(reqparameters).length > 0 ? reqparameters : { "search": ' ',"rowsperpage": 10 , "page": 1,"orderby" : 'id', "orderbytype":'asc' };
 
  // filtering data based on search keyword.. if there is no search keyword entered then show all data
  let filtereddata = (search.trim().length===0) ? data : data.filter((object) => Object.values(object).some((i) => String(i).toLowerCase().includes(search.toLowerCase()))   );

  // calculations related to pagination
  let numberofrecords = filtereddata.length;

  page = page < 1   ? 1 : page ;

  let startIndex =   numberofrecords > (page - 1) * rowsperpage ? (page - 1) * rowsperpage : 0 ;
  let endIndex   = numberofrecords <= page * rowsperpage ? numberofrecords : page * rowsperpage;
  let firstpagenumber = numberofrecords > 0 ? 1 : 0;
  let lastpagenumber = Math.ceil(numberofrecords / rowsperpage);

  let nextpagenumber = numberofrecords > page * rowsperpage ? parseInt(page) + 1 : 0;
  let Prevpagenumber = page > 1 &&  lastpagenumber > 1  ? page - 1 : 0;
  

  //sorting using lodash underscore library
  let sorteddata = orderbytype == "asc" ? _.sortBy(filtereddata, orderby) : _.sortBy(filtereddata, orderby).reverse();
  // showing results for the enetered/selected page only if the enetered/input page number is with in the last page number limit.. and the applying number of rows to show  and only if 
  let results = page <= lastpagenumber ?  sorteddata.slice(startIndex, endIndex) : {};
  //let results = sorteddata.slice(startIndex, endIndex) ;
  let paginationdetails = {numberofrecords,startIndex,endIndex,firstpagenumber,nextpagenumber,Prevpagenumber,lastpagenumber,};

  let paginatedresults = { paginationdetails, results };

  return paginatedresults;
}

const getComments = async (request, response) => {
  let selectQuery = `SELECT id ,trim(comment) as comment ,to_char(created_at,'yyyy-mm-dd') created_at FROM commnetstable order by id `;

  let queryresult;

  queryresult = pool.query(selectQuery, (error, result) => {
    if (error) {
      throw error;
    }

    
    //passing the data to pagination function 
    let results = paginationwithsearchandsort(result.rows,request.query ) ; // request.params);

    response.status(200).json(results);
    
  });
};

const createComment = (request, response) => {
  const { comment } = request.body;
  pool.query(
    "INSERT INTO commnetstable (comment) VALUES (trim($1)) RETURNING *",
    [comment],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

//app.get("/v1/api/comments/:search/:rowsperpage/:page/:orderby/:orderbytype",getComments );
app.get("/v1/api/comments",getComments );
app.post("/v1/api/comments", createComment);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can not find ${req.originalUrl} on this server`
  })
})

module.exports = app;
