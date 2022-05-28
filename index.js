const express = require("express");
const { google } = require("googleapis");
const { composer } = require("googleapis/build/src/apis/composer");
const https = require('https')
var axios = require("axios").default;
const qs = require('qs')
var access_token
var refresh_token=null;
var codeid;
var d;
var err=false;

// function redirect() {
//   window.location.href = "http://localhost:1337";
  
// }




const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/addbill", (req, res) => {
  res.render("index");
  
});

var options = {
  method: 'POST',
  url: 'https://gymkhana.iitb.ac.in/profiles/oauth/token/',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: {
    grant_type: 'authorization_code',
    client_id: 'Rg3eTrYvWW3mgeadhDP4mVaGZ3mk7OUFsgiLFP3J',
    client_secret: 'mVhKuyJpUYeqcwGeZdUM1pP53cM3RCEaKlWpcTXsp22lZZdvXjEAVUY271K4TXYmoWiR3zstfEmCSEc2Q5zC0fqMteET5829FNzyJWk7b8IYnQgjhry2zhxPQSf6AzXR',
    code: 'KVTE1DJUbRMzxAcsg6z6z3GACLXM7A',
    redirect_uri: 'http://localhost:1337/home'
  }
};

// app.get("/home", (req, res) => {

//   codeid=req.query.code
//   var s;

//   /////Token Exchange
//   var options_post = {
//     method: 'POST',
//     url: 'https://gymkhana.iitb.ac.in/profiles/oauth/token/',
//     headers: {'content-type': 'application/x-www-form-urlencoded'},
//     data: qs.stringify({
//       grant_type: 'authorization_code',
//       client_id: 'Rg3eTrYvWW3mgeadhDP4mVaGZ3mk7OUFsgiLFP3J',
//       client_secret: 'mVhKuyJpUYeqcwGeZdUM1pP53cM3RCEaKlWpcTXsp22lZZdvXjEAVUY271K4TXYmoWiR3zstfEmCSEc2Q5zC0fqMteET5829FNzyJWk7b8IYnQgjhry2zhxPQSf6AzXR',
//       code: String(codeid),
//       redirect_uri: 'http://localhost:1337/home'
//     })
//   };

//   axios.request(options_post).then(function (response) {
//     console.log(response.data);
//     access_token=response.data.access_token;
//     refresh_token=response.data.refresh_token;

//   })
//   .catch(function (error) {
//     console.error(error.response.status);
//   });
//   res.render(home);

// });

app.get("/home",(req,res)=>{

  codeid=req.query.code

  var options_post = {
    method: 'POST',
    url: 'https://gymkhana.iitb.ac.in/profiles/oauth/token/',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: 'Rg3eTrYvWW3mgeadhDP4mVaGZ3mk7OUFsgiLFP3J',
      client_secret: 'mVhKuyJpUYeqcwGeZdUM1pP53cM3RCEaKlWpcTXsp22lZZdvXjEAVUY271K4TXYmoWiR3zstfEmCSEc2Q5zC0fqMteET5829FNzyJWk7b8IYnQgjhry2zhxPQSf6AzXR',
      code: String(codeid),
      redirect_uri: 'http://localhost:1337/home'
    })
  };

  var options_post1 = {
    method: 'POST',
    url: 'https://gymkhana.iitb.ac.in/profiles/oauth/token/',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: qs.stringify({
      grant_type: 'refresh_token',
      client_id: 'Rg3eTrYvWW3mgeadhDP4mVaGZ3mk7OUFsgiLFP3J',
      client_secret: 'mVhKuyJpUYeqcwGeZdUM1pP53cM3RCEaKlWpcTXsp22lZZdvXjEAVUY271K4TXYmoWiR3zstfEmCSEc2Q5zC0fqMteET5829FNzyJWk7b8IYnQgjhry2zhxPQSf6AzXR',
      refresh_token: String(refresh_token),
      redirect_uri: 'http://localhost:1337/home'
    })
  };
  
 Promise.all([
    axios.request(options_post).then(function (response) {
      console.log(response.data);
      console.log("req1 working");
      access_token=response.data.access_token;
      refresh_token=response.data.refresh_token;
  
    })
      .catch(function (error) {
    console.error(error.response.status);
  }),
    axios.request(options_post1).then(function (response) {
      console.log(response.data);
      console.log("req2 working");

      access_token=response.data.access_token;
      refresh_token=response.data.refresh_token;
  
    })
      .catch(function (error) {
    console.error(error);
    console.log("req2 not working");

  })
  ]);


  res.render("home")



});

app.get("/", (req, res) => {
  res.render("login"); 
});

app.get("/status", async (req, res) => {
  

  ////getting user data
var options_get = {
  method: 'GET',
  url: 'https://gymkhana.iitb.ac.in/profiles/user/api/user/?fields=first_name,last_name,type,profile_picture,sex,username,email,program,contacts,insti_address,secondary_emails,mobile,roll_number',
  headers: {'content-type': 'application/x-www-form-urlencoded','authorization':'Bearer ' + String(access_token)},
 
};

axios.request(options_get).then(function (response) {
   d=Object.values(response.data)
  console.log(d);  
}).catch(function (error) {
  console.error(error.response.status);
  res.redirect('/')
})



  const auth = new google.auth.GoogleAuth({
    keyFile: "readdata-346322-e567be4e5927.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1TPPfULBNl_u6kR6A-kD9S8-yM8IVroLe3zAY9As2p2Y";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });



 var data_array=getRows.data.values

  res.render("status",{data:data_array,d});
  
});

app.post("/addbill", async (req, res) => {

  var options_get = {
    method: 'GET',
    url: 'https://gymkhana.iitb.ac.in/profiles/user/api/user/?fields=first_name,last_name,type,profile_picture,sex,username,email,program,contacts,insti_address,secondary_emails,mobile,roll_number',
    headers: {'content-type': 'application/x-www-form-urlencoded','authorization':'Bearer ' + String(access_token)},
   
  };
  
  axios.request(options_get).then(function (response) {
     d=Object.values(response.data)
    console.log(d);  
  }).catch(function (error) {
    console.error(error.response.status);
    res.redirect('/')
  })

  const { name,link } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "readdata-346322-e567be4e5927.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1TPPfULBNl_u6kR6A-kD9S8-yM8IVroLe3zAY9As2p2Y";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[d[1], name,link]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});



app.get("/get", (req, res) => {

  
  
});

app.listen(1337, (req, res) => console.log("running on 1337"));


