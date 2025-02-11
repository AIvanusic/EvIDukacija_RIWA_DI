const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const config = require('./config')
const cors = require('cors')
const port = 3000 // port na kojem radi server dok smo s projektom na 9000

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(cors({ origin: '*' }))

// Stvaranje veze na bazu - zašto ovo uz datoteku config.js?
const pool = mysql.createPool(config.db)

// Funkcija za izvršavanje SQL upita
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

// Provjera da API radi
app.get('/', (req, res) => {
  res.json({ message: 'Provjereno: API funkcionira!' })
})

app.get('/api/polaznici_polaznici', async function (req, res, next) {
  try {
    const result_polaznici = await query('SELECT * FROM RIWA_Polaznik')
    res.json(result_polaznici)
  } catch (err) {
    console.error('Oprostite. Došlo je do pogreške u očitavanju baze ', err.message)
    next(err)
  }
})

app.get('/api/polaznici_edukacije', async function (req, res, next) {
  try {
    const result_edukacije = await query('SELECT * FROM RIWA_Edukacija')
    res.json(result_edukacije)
  } catch (err) {
    console.error('Oprostite. Došlo je do pogreške u očitavanju baze ', err.message)
    next(err)
  }
})

app.get('/api/polaznici_termini', async function (req, res, next) {
  try {
    const result_termini = await query('SELECT * FROM RIWA_Termin')
    res.json(result_termini)
  } catch (err) {
    console.error('Oprostite. Došlo je do pogreške u očitavanju baze ', err.message)
    next(err)
  }
})

app.listen(port, () => {
  console.log(`Server osluškuje na: http://localhost:${port}`)
})
