const express = require('express')
const app = express()
const mysql = require('mysql2/promise')
const config = require('./config')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3000 // port na kojem radi server dok smo s projektom na 9000

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
// Stvaranje veze na bazu - zašto ovo uz datoteku config.js?
app.use(express.static(__dirname))
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

// POST ruta za spremanje evidencije
app.post('/api/evidencija', async (req, res, next) => {
  try {
    const { polaznikId, edukacijaId, terminId } = req.body

    if (!polaznikId || !edukacijaId || !terminId) {
      return res.status(400).json({ error: 'Nedostaju podaci za spremanje evidencije!' })
    }

    // Upit za unos u tablicu RIWA_Evidencija
    const [result] = await pool.query(
      'INSERT INTO RIWA_Evidencija (idPolaznika, idEdukacije, idTermina) VALUES (?, ?, ?)',
      [polaznikId, edukacijaId, terminId],
    )

    res.json({ message: 'Evidencija uspješno spremljena!', idEvidencija: result.insertId })
  } catch (err) {
    console.error('Greška pri spremanju evidencije: ', err.message)
    next(err)
  }
})

app.get('/evidencija', (req, res) => {
  res.sendFile(__dirname + '/Prikazevidencije.html')
})

app.get('/api/evidencija', async function (req, res, next) {
  try {
    const result = await query(`
      SELECT e.idZapisa AS idEvidencije, p.imeIPrezimePolaznika AS polaznik, n.imeIPrezimeNastavnika AS nastavnik, ed.nazivEdukacije AS edukacija, t.termin
      FROM RIWA_Evidencija e
      LEFT JOIN RIWA_Polaznik p ON e.idPolaznika = p.idPolaznika
      LEFT JOIN RIWA_Nastavnik n ON e.idNastavnika = n.idNastavnika
      LEFT JOIN RIWA_Edukacija ed ON e.idEdukacije = ed.idEdukacije
      LEFT JOIN RIWA_Termin t ON e.idTermina = t.idTermina
    `)
    res.json(result)
  } catch (err) {
    console.error('Greška pri dohvaćanju evidencije: ', err.message)
    next(err)
  }
})

app.listen(port, () => {
  console.log(`Server osluškuje na: http://localhost:${port}`)
})
