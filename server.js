const { query } = require('express');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {Pool} = require("pg");
const validator = require('express-validator');
const cors = require('cors');

const pool = new Pool({
    // host: 'localhost',
    // user: 'postgres',
    // database: 'cyf_hotel',
    // password: 'postgres',
    // port: 5432
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
      },

})

app.use(cors());

// MIDDLEWARE TO ACCESS JSON PAYLOAD OF CREATE REQUEST
app.use(express.json());


app.get('/', async(req, res) => {
    res.send('HOME PAGE');
})

// CREATE HOTEL
app.post("/hotels", async (req, res) => {
    let {name, rooms, postcode} = req.body;
    rooms = Number(rooms);
    console.log('A POST request was made!');
    console.log(name, rooms, postcode);

    await pool.query("INSERT INTO hotels (name, rooms, postcode) VALUES ($1, $2, $3);", [name, rooms, postcode]);
    const selectedHotels = await pool.query('SELECT * FROM hotels;');

    console.log(selectedHotels.rows);
    res.json(selectedHotels.rows);
    
})

app.get("/customers", (req, res) => {
    console.log("A GET request was made.")
    pool.query('SELECT * FROM customers').then(result => res.json(result.rows)).catch(error => {hotel
            console.log(error);
            res.status(500).send(`There was a problem! ${error}`);
        })
    // return res.send('GET request made to path "/customers"');
})

app.put("/customers/:id", async (req, res) => {
    const id = Number(req.params.id);
    const {email} = req.body;
    try{
        await pool.query('UPDATE customers SET email=$1 WHERE id=$2', [email, id]);
        const updatedRecord = await pool.query('SELECT * FROM customers WHERE id=$1;', [id]);
        res.json(updatedRecord.rows);
    } catch (error) {
        res.send(error);
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
})