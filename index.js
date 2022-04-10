const express = require("express");
const { google } = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('../views/', {index: 'home.html'}))
app.get("/addbill", (req, res) => {
  res.render("index");
  
});
app.get("/", (req, res) => {
  res.render("home");
  
});
app.get("/status", async (req, res) => {
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
  console.log(data_array)

  
  res.render("status",{data:data_array});
  
});

app.post("/addbill", async (req, res) => {
  const { rollno, name,link } = req.body;

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
      values: [[rollno, name,link]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(1337, (req, res) => console.log("running on 1337"));
