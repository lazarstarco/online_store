const express = require('express')
const multer = require('multer')
const xlsxFile = require('read-excel-file/node')
const router = new express.Router()

let lastFile = ''

const multerConfig = {
    storage: multer.diskStorage({
        destination: function (req, file, next) {
            next(null, './src/files');
        },
        filename: function (req, file, next) {
            const fullext = file.mimetype.split('/')[1];
            let ext = ''
            if (fullext === 'vnd.ms-excel') {
                ext = 'xls'
            }
            if (fullext === 'vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                ext = 'xlsx'
            }
            lastFile = file.fieldname + '-' + Date.now() + '.' + ext
            next(null, lastFile);
        }
    })
}

router.get('/upload', (req, res) => {
    const connection = req.app.locals.connection

    res.render('upload')
})

router.post('/upload', multer(multerConfig).single('excel'), (req, res) => {
    const connection = req.app.locals.connection

    let path = __dirname + '\\..\\src\\files\\' + lastFile
    console.log(path)
    let items = []

    xlsxFile(path).then((rows) => {
        rows.shift()

        rows.forEach(row => {
            let item = {
                ID: row[0],
                Category_ID: row[1],
                Name: row[2],
                Price: row[3],
                Quantity: row[4]
            }

            items.push(item)
        })

        for (let i = 0; i < items.length; i++) {
            let url =
                `INSERT INTO 
items (item_id, category_id, name, price, quantity)
VALUES
(${items[i].ID}, ${items[i].Category_ID}, '${items[i].Name}', ${items[i].Price}, ${items[i].Quantity})
ON DUPLICATE KEY UPDATE
name = '${items[i].Name}',
price = ${items[i].Price},
quantity = ${items[i].Quantity}`

            connection.query(url, (error, result) => {
                if (error) throw Error(error)
            })
        }
    }).catch((error) => {
        throw Error(error)
    })

    res.redirect('upload')
})


module.exports = router