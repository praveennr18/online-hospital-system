import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import path from "path";
import pg from "pg";
import ejs from "ejs";



const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "dbms",
  password: "praveen",
  port: 5432,
});
db.connect();

import { fileURLToPath } from "url";
import { link } from "fs";
const app = express();
const port = 300;
const __dirname = dirname(fileURLToPath(import.meta.url));


// Set the 'views' directory to the 'views' folder

//app.use(express.static('/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname + '/public')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/admin.html",(req,res)=>{
  res.sendFile(__dirname+"/views/admin.html")
})
app.get("/doctor.html",(req,res)=>{
  res.sendFile(__dirname+"/views/doctor.html")
})
app.get("/patient.html",(req,res)=>{
  res.sendFile(__dirname+"/views/patient.html")
})

app.get("/patient-login.html",(req,res)=>{
  res.sendFile(__dirname+"/views/patientregistration.html")
})
///doctor/doctorregister.html
//
app.get("/doctor/doctorregister.html",(req,res)=>{
  res.sendFile(__dirname+"/views/doctorregister.html")
})
app.get("/views/thankyou.html",(req,res)=>{
  res.sendFile(__dirname+"/views/thankyou.html")
})
app.get("/about.html",(req,res)=>{
  res.sendFile(__dirname+"/views/about.html")
})
app.get("/contact.html",(req,res)=>{
  res.sendFile(__dirname+"/views/contact.html")
})
app.use(bodyParser.json());
// database code
app.post('/admin-gets-loggedin', async(req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password match a record in the database
    const results = await db.query('SELECT * FROM admin WHERE username = $1 AND password = $2', [username, password]);
    const data = await db.query('SELECT firstname , username , phonenumber,specialization FROM doctors');
    const dataFromDatabase = data.rows;
    
    if (results.rows.length == 1) {
      res.render("admingetslogging.ejs",{doctors : dataFromDatabase} )
    } else {
      res.sendFile(__dirname+"/views/wrong.html")
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
  });

app.post('/register-doctor', async (req, res) => {
  try {
    const { firstname, username, phonenumber, password, specialization } = req.body;

    // Insert data into the doctors table
    const result = await db.query(
      'INSERT INTO doctors (firstname, username, phonenumber, password, specialization) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [firstname, username, phonenumber, password, specialization]
    );
    res.sendFile(__dirname+"/views/doctor.html");

    // res.json({ success: true, message: 'Doctor registered successfully' });
  } catch (error) {
    // console.error('Error registering doctor:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
// doctor loging in
// 
//
app.post('/login-doctor', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password match a record in the database
    const result = await db.query('SELECT * FROM doctors WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length === 1) {
      
      //res.json({ success: true, message: 'Login successful' });
      const curr_data= await db.query('SELECT problem_id, problem FROM patient_request WHERE doctorusername = $1' , [username]);
      const senddata=curr_data.rows
      console.log(senddata)
      res.render("doctorafterlogging.ejs",{patientData:senddata});
    } else {
      res.sendFile(__dirname+"/views/wrong.html")
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
//
//
//
// patient register 
app.post('/submitpatient-form', (req, res) => {
  const { firstname, username, phonenumber, address, password } = req.body;

 
  const insertQuery = `INSERT INTO patient (firstname, username, phonenumber, address, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [firstname, username, phonenumber, address, password];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Error inserting data into the database' });
      throw err;
    }

    res.sendFile(__dirname+"/views/patient.html");
  });
});
//
//
// patient login authentication
app.post('/login-patient', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password match a record in the database
    const result = await db.query('SELECT * FROM patient WHERE username = $1 AND password = $2', [username, password]);

    if (result.rows.length === 1) {
      // res.json({ success: true, message: 'Login successful' });
      try {
        // Query the PostgreSQL database
       
        
        const result = await db.query('SELECT * FROM patient_request where username=$1',[username]);
        
        const dataFromDatabase = result.rows;
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'ejs');
        
    
        // Render the EJS template and pass the data
        res.render("patientafterlogging.ejs", { data: dataFromDatabase });
      } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).send('Internal Server Error inside');
      }
    } else {
      res.sendFile(__dirname+"/views/wrong.html")
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
);
/*






*/
// when patient click login
/*app.post('/login-patient', async (req, res) => {
  try {
    // Query the PostgreSQL database
    const result = await pool.query('SELECT * FROM patient_request');
    
    // Extract the rows from the result
    const dataFromDatabase = result.rows;

    // Render the EJS template and pass the data
    res.render('/views/patientafterlogging.ejs', { data: dataFromDatabase });
  } catch (error) {
    console.error('Error querying database:', error);
    res.status(500).send('Internal Server Error');
  }
});
*/
app.post('/registered-a-problem', async (req, res) => {
  const { doctorusername, problem,username } = req.body;

  try {
    // Insert data into the patient_request table
    const query = `
      INSERT INTO patient_request ( doctorusername, problem,username)
      VALUES ($1, $2,$3)
    `;
    const values = [ doctorusername, problem,username];
    await db.query(query, values);
    res.sendFile(__dirname+"/views/thankyou.html")
    // Redirect to a success page or display a success message
 
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/submit-doctor-response',async(req,res)=>{
  const {problem_id , response }=req.body;
  try{
    const query1=`insert into doctor_response (problem_id,response) values($1,$2)`;
    const values= [problem_id,response];
    await db.query(query1,values);
    const query2=`UPDATE patient_request
    SET response = (SELECT response
                          FROM doctor_response
                          WHERE doctor_response.problem_id = patient_request.problem_id)
    WHERE EXISTS (SELECT 1
                  FROM doctor_response
                  WHERE doctor_response.problem_id = patient_request.problem_id);`
    await db.query(query2);
    res.sendFile(__dirname+"/views/thankyou.html")

  }
  catch(error){
    console.log(error);
  }
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});