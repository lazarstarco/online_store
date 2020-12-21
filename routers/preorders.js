const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.use(cookieParser())

// const transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "f2f05ca7322ef9",
//         pass: "b09cd7b041d84c"
//     }
// });

router.get('/preorders', (req, res) => {
    const connection = req.app.locals.connection
    let url = `SELECT p.id, i.item_id, i.name, i.price, i.quantity AS "item_quantity", p.quantity AS "preorder_quantity" FROM items i INNER JOIN preorders p ON i.item_id = p.item_id WHERE p.user_id = '${req.cookies['lscartcookie']}' AND p.status = 'ACTIVE' ORDER BY i.item_id` 
    connection.query(url, (error, result) => {
        if (error) throw error
        res.render('preorders', { send: { result } })
    })
})

router.post('/preorders', (req, res) => {
    const connection = req.app.locals.connection
    let url = `INSERT INTO orders (user_id, name, surname, phone_number, email, address, city, zip, country, payment, delivery) VALUES (
        '${req.cookies['lscartcookie']}',
        '${req.body.name}',
        '${req.body.surname}',
        '${req.body.phonenum}',
        '${req.body.email}',
        '${req.body.address}',
        '${req.body.city}',
        ${req.body.zip},
        '${req.body.country}',
        '${req.body.payment}',
        '${req.body.delivery}'
    );`
    connection.query(url, (error, result) => {
        if (error) throw error
        url = `INSERT INTO order_items (order_id, item_id, title, category, quantity, unit_price, unit_margin, unit_pdv,
            unit_total, total_price, total_margin, total_pdv, total)
            SELECT 
            ${result.insertId},
            p.item_id,
            i.name,
            c.name,
            p.quantity,
            i.price,
            (i.price * c.margin / 100), 
            (i.price * 20 / 100),
            (i.price + (i.price * c.margin / 100) + (i.price * 20 / 100)), 
            (i.price * p.quantity),
            ((i.price * c.margin / 100) * p.quantity), 
            ((i.price * 20 / 100) * p.quantity), 
            ((i.price + (i.price * c.margin / 100) + (i.price * 20 / 100)) * p.quantity)
            FROM (items i INNER JOIN preorders p ON i.item_id = p.item_id)
            INNER JOIN categories c on i.category_id = c.id
            WHERE p.user_id = '${req.cookies['lscartcookie']}' AND p.status = 'ACTIVE';
            UPDATE preorders SET status = 'ORDERED' WHERE user_id = '${req.cookies['lscartcookie']}' AND status = 'ACTIVE'`
        connection.query(url, (error, result) => {
            if (error) throw error
        })
    })
})

// router.post('/preorders', (req, res) => {
//     const message = {
//         // Sender address
//         from: 'lazar2nd@gmail.com',

//         // List of recipients
//         to: 'random@email.com',

//         // Subject line
//         subject: 'Subject line',

//         // Plain text body
//         text: ``
//     }

//     transport.sendMail(message, function (err, info) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(info);
//         }
//     })
// })

router.post('/preorders/quantity', (req, res) => {
    const connection = req.app.locals.connection
    let url = `UPDATE preorders SET quantity = '${req.body.quantity}' WHERE id = ${req.body.id}`
    connection.query(url, (error, result) => {
        if (error) throw error
    })
    res.redirect('.')
})

router.post('/preorders/delete', (req, res) => {
    const connection = req.app.locals.connection
    let url = `UPDATE preorders SET status = 'DELETED' WHERE id = ${req.body.id}`
    connection.query(url, (error, result) => {
        if (error) throw error
    })
    res.redirect('.')
})

module.exports = router