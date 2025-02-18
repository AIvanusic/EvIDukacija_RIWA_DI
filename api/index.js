const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000 // port na kojem radi server dok smo s projektom na 9000
const mysql = require('mysql2/promise')
const config = require('./config')
const bodyParser = require('body-parser')

async function query(sql, params) {
  try {
    const connection = await mysql.createConnection(config.db)
    const [results] = await connection.execute(sql, params)

    return results
  } catch (error) {
    console.error(error.message)
  }
}
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

// Provjera da API radi
app.get('/api', (req, res) => {
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

// dohvaćanje podataka o sveučilištu (za ispis)
app.get('/api/RIWA_Sveuciliste', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM RIWA_Sveuciliste')
    if (result.length > 0) {
      res.json(result[0]) // Vraća prvi rezultat iz baze
    } else {
      res.status(404).json({ message: 'Nema podataka za prikaz' })
    }
  } catch (err) {
    console.error('Greška pri dohvaćanju podataka o Sveučilištu: ', err.message)
    next(err)
  }
})

// dohvaćanje podataka o edukacijama (odabir edukacije)
app.get('/api/RIWA_Edukacija', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM RIWA_Edukacija')
    res.json(result)
  } catch (err) {
    console.error('Greška pri dohvaćanju podataka o edukacijama: ', err.message)
    next(err)
  }
})

// dohvaćanje podataka o nastavnicima izvođačima edukacije
app.get('/api/RIWA_Nastavnik', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM RIWA_Nastavnik')
    res.json(result)
  } catch (err) {
    console.error('Greška pri dohvaćanju podataka o nastavnicima: ', err.message)
    next(err)
  }
})

// dohvaćanje podataka o terminima održavanja edukacije
app.get('/api/RIWA_Termin', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM RIWA_Termin')
    res.json(result)
  } catch (err) {
    console.error('Greška pri dohvaćanju podataka o terminima: ', err.message)
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

app.post('/api/RIWA_Evidencija', async (req, res, next) => {
  try {
    const { idEdukacija, idNastavnika, idTermina } = req.body

    if (!idEdukacija || !idNastavnika || !idTermina) {
      return res.status(400).json({ error: 'Nedostaju podaci za spremanje evidencije!' })
    }

    // Upit za unos u tablicu RIWA_Evidencija
    const [result] = await pool.query(
      'INSERT INTO RIWA_Evidencija (idEdukacije, idNastavnika, idTermina) VALUES (?, ?, ?)',
      [idEdukacija, idNastavnika, idTermina],
    )

    res.json({ message: 'Evidencija uspješno spremljena!', idEvidencija: result.insertId })
  } catch (err) {
    console.error('Greška pri spremanju evidencije: ', err.message)
    next(err)
  }
})

// PUT ruta za uređivanje evidencije
app.put('/api/RIWA_Evidencija', async (req, res, next) => {
  try {
    const { idEdukacija, idNastavnika, idTermina } = req.body

    if (!idEdukacija || !idNastavnika || !idTermina) {
      return res.status(400).json({ error: 'Nedostaju podaci za uređivanje evidencije!' })
    }

    // Upit za uređivanje u tablici RIWA_Evidencija
    await pool.query(
      'UPDATE RIWA_Evidencija SET idNastavnika = ?, idTermina = ? WHERE idEdukacije = ?',
      [idNastavnika, idTermina, idEdukacija],
    )

    res.json({ message: 'Evidencija uspješno uređena!' })
  } catch (err) {
    console.error('Greška pri uređivanju evidencije: ', err.message)
    next(err)
  }
})

// DELETE ruta za brisanje evidencije
app.delete('/api/RIWA_Evidencija', async (req, res, next) => {
  try {
    const { idEdukacija, idNastavnika, idTermina } = req.body

    if (!idEdukacija || !idNastavnika || !idTermina) {
      return res.status(400).json({ error: 'Nedostaju podaci za brisanje evidencije!' })
    }

    // Upit za brisanje iz tablice RIWA_Evidencija
    await pool.query(
      'DELETE FROM RIWA_Evidencija WHERE idEdukacije = ? AND idNastavnika = ? AND idTermina = ?',
      [idEdukacija, idNastavnika, idTermina],
    )

    res.json({ message: 'Evidencija uspješno obrisana!' })
  } catch (err) {
    console.error('Greška pri brisanju evidencije: ', err.message)
    next(err)
  }
})

app.get('/api/evidencija', (req, res) => {
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

app.get('/api/RIWA_Edukacija', async function (req, res, next) {
  try {
    const sveIzEdukacija = await query('SELECT * FROM RIWA_Edukacija')

    res.json(sveIzEdukacija)
  } catch (err) {
    console.error('Greška u čitanju popisa edukacija ', err.message)
    next(err)
  }
})
app.put('/api/RIWA_Edukacija', async function (req, res, next) {
  try {
    const sveIzEdukacija = await query(
      'UPDATE RIWA_Edukacija SET nazivEdukacije=:nazivEdukacije WHERE idEdukacije=:idEdukacije',
      {
        idEdukacije: req.body.idEdukacije,
        nazivEdukacije: req.body.nazivEdukacije,
      },
    )

    res.json(sveIzEdukacija)
  } catch (err) {
    console.error('Greška u ažuriranju popisa edukacija ', err.message)
    next(err)
  }
})

app.post('/api/RIWA_Edukacija', async function (req, res, next) {
  try {
    const sveIzEdukacija = await query(
      'INSERT INTO RIWA_Edukacija (nazivEdukacije) VALUES (:nazivEdukacije)',
      {
        nazivEdukacije: req.body.nazivEdukacije,
      },
    )

    res.json(sveIzEdukacija)
  } catch (err) {
    console.error('Greška u ubacivanju nove edukacije u popis edukacija ', err.message)
    next(err)
  }
})
app.delete('/api/RIWA_Edukacija', async function (req, res, next) {
  console.log(req.body)
  try {
    const sveIzEdukacija = await query(
      'DELETE FROM RIWA_Edukacija WHERE idEdukacije=:idEdukacije',
      {
        idEdukacije: req.body.idEdukacije,
      },
    )

    res.json(sveIzEdukacija)
  } catch (err) {
    console.error('Greška u brisanju edukacije s popisa edukacija ', err.message)
    next(err)
  }
})

app.listen(port, () => {
  console.log(`Server osluškuje na: http://localhost:${port}`)
})
