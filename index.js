import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import path from "path";
import pg from "pg";
import ejs from "ejs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
// Database configuration

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CERT,
  },
};

// Database connection
const db = new pg.Client(config);
db.connect((err) => {
    if (err) throw err;
    console.log("Database connected successfully");
});

// App initialization
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 300;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

// Example routes for static files
app.get("/admin.html", (req, res) => res.sendFile(__dirname + "/views/admin.html"));

// POST route for admin login
app.post("/admin-gets-loggedin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const results = await db.query("SELECT * FROM admin WHERE username = $1 AND password = $2", [username, password]);
        const doctors = await db.query("SELECT firstname, username, phonenumber, specialization FROM doctors");

        if (results.rows.length > 0) {
            res.render("admingetslogging.ejs", { doctors: doctors.rows });
        } else {
            res.sendFile(__dirname + "/views/wrong.html");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Example doctor registration
app.post("/register-doctor", async (req, res) => {
    const { firstname, username, phonenumber, password, specialization } = req.body;
    try {
        await db.query(
            "INSERT INTO doctors (firstname, username, phonenumber, password, specialization) VALUES ($1, $2, $3, $4, $5)",
            [firstname, username, phonenumber, password, specialization]
        );
        res.sendFile(__dirname + "/views/doctor.html");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Server listening
app.listen(port, () => console.log(`Listening on port ${port}`));
