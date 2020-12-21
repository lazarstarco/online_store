const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const router = new express.Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

router.use(cookieParser())

function createCookie(req, res, next) {
    const { cookies } = req
    if ('lscartcookie' in cookies && req.cookies['lscartcookie'] !== undefined) {
    } else {
        const name = 'lscartcookie'
        const val = 'user' + Math.floor(Math.random() * (100 - 10) + 10) + Date.now()
        const expire = 5 * 365 * 24 * 60 * 60 * 1000
        res.cookie(name, val, { maxAge: expire })
    }
    next()
}

router.get('/', [createCookie], (req, res) => {
    const connection = req.app.locals.connection
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 4
    const offset = (page - 1) * limit

    if (Object.keys(req.query).length === 0) {
        return res.redirect(`/?page=${page}&limit=${limit}`)
    }

    let url = `SELECT items.*, preorders.quantity AS "preorders_quantity" FROM items LEFT OUTER JOIN preorders ON items.item_id = preorders.item_id AND preorders.user_id = "${req.cookies['lscartcookie']}" AND preorders.status = "ACTIVE" ORDER BY items.item_id`
    connection.query(url, (error, resultAll) => {
        if (error) throw error
        const result = resultAll.splice(offset, limit)
        const data = {number: Math.ceil(resultAll.length / limit) + 1,page,limit}
        res.render('index', { result, data })
    })
})

router.get('/src=:src', (req, res) => {
    const connection = req.app.locals.connection
    let srcString = req.params.src.trim().split(' ')
    let url = `SELECT * FROM items WHERE item_id = '${srcString[0]}' OR (LOWER(name) LIKE TRIM(LOWER('%${srcString[0]}%`

    for (let i = 1; i < srcString.length; i++) {
        url += ` ${srcString[i]}%`
    }
    url += `')))`

    connection.query(url, (error, result) => {
        if (error) throw error

        res.render('index', { result })
    })
})

router.post('/', (req, res) => {
    if (req.cookies['lscartcookie'] !== undefined) {
        const connection = req.app.locals.connection
        let url = `UPDATE preorders SET quantity = ${req.body.quantity} WHERE user_id = '${req.cookies['lscartcookie']}' AND item_id = ${req.body.item_id} AND status = 'ACTIVE'`
        connection.query(url, (error, result) => {
            if (error) throw error
            if (result.affectedRows === 0) {
                url = `INSERT INTO preorders (user_id, item_id, quantity, status)
                VALUES ('${req.cookies['lscartcookie']}', ${req.body.item_id}, ${req.body.quantity}, 'ACTIVE')`
                connection.query(url, (error, result) => {
                    if (error) throw error
                })
            }
        })
    }
    res.redirect('/')
})

module.exports = router