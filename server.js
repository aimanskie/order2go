const express = require('express')
const { Pool } = require('pg')
const session = require('express-session')
const methodOverride = require('method-override')
const bcrypt = require('bcrypt')
const saltRounds = 10;
// const fs = require('fs')
const port = 8080

// initialize
const app = express()
// pool for continous process of app
const db = new Pool({
  database: 'ordertogo'
})
// connect db postgres
db.connect(function (err) {
  if (err) {
    console.log("Cannot connect to database...", err)
  }
  console.log('Connected to database...')
})
app.set('view engine', 'ejs')
// bodyparse
app.use(express.urlencoded({ extended: true }))
// for put and delete
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
// use css html files
app.use(express.static('public'))
// maintain sessions for users, memory, cache?
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

// ADMIN
// staff dashboard to add menu, edit and delete menu
app.get('/staff_dashboard', (req, res) => {
  db.query('SELECT * FROM menu', (err, dbRes) => {
    if (err) {
      next(err)
      return
    }
    let menu = dbRes.rows
    res.render('staff_dashboard', {
      menu: menu
    })
  })
})
// add menu feature in dashboard
app.post('/staff/add-menu', (req, res) => {
  sql = `insert into menu (name, image_url, price, description) values ($1, $2, $3, $4);`
  db.query(sql, [req.body.name, req.body.image_url, req.body.price, req.body.description], (err, dbRes) => {
    res.redirect('/staff_dashboard')
  })
})
// delete or deactivate the item from showing the menu in front
app.delete('/delete-product/:id', (req, res) => {
  let sql = `delete from menu where id = $1`
  db.query(sql, [req.params.id], (err, dbRes) => {
    res.redirect('/staff_dashboard')
  })
})
// get to the page to edit
app.get('/edit-product/:id', (req, res) => {
  let sql = `select * from menu where id = $1`
  db.query(sql, [req.params.id], (err, dbRes) => {
    let menu = dbRes.rows[0]
    res.render('edit-product', { menu: menu })
  })
})
// to do the edit on the server
app.put('/edit-product/:id', (req, res) => {
  let sql = `update menu set name = $1, image_url = $2, price = $3, description = $4 where id = $5`
  db.query(sql, [req.body.name, req.body.image_url, req.body.price, req.body.description, req.params.id], (err, dbRes) => {
    res.redirect('/staff_dashboard')
  })
})

// USER
// fontpage of app, all displayed menu
app.get('/', (req, res, next) => {
  db.query('SELECT * FROM menu', (err, dbRes) => {
    if (err) {
      next(err)
      return
    }
    let menu = dbRes.rows
    res.render('layout', {
      menu: menu
    })
  })
})
// user press on view details to see more
app.get('/products/:id', (req, res) => {
  sql = `select * from menu where id = $1`
  id = req.params.id
  db.query(sql, [id], (err, dbRes) => {
    if (err) {
      return
    }
    let menu = dbRes.rows[0] // [{ name: 'pudding' }]
    res.render('product-detail', { menu: menu })
  })
})
// user press on add to cart button
app.get('/add-to-cart/:id', (req, res) => {
  let id = req.params.id
  let sql = `select * from menu where id = $1`
  db.query(sql, [id], (err, dbRes) => {
    let menu = dbRes.rows[0]
    let orderName = menu.name
    let orderPrice = menu.price
    let sql = `insert into orders (name, price) values ($1, $2);`
    db.query(sql, [orderName, orderPrice], (err, dbRes2) => {
    })
  })
  res.redirect('/')
})
// the actual addtocart/checkout page
app.get('/add-to-cart', (req, res) => {
  let sql2 = `select name,price,count(*) as "quantity" from orders group by name,price;`
  db.query(sql2, (err, dbRes) => {
    let order = dbRes.rows
    res.render('add-to-cart', { order: order })
  })
})
// remove the item
app.delete('/remove-cart/:name', (req, res) => {
  let name = req.params.name
  console.log(name)
  let sql = `delete from orders where name = $1`
  db.query(sql, [name], (err, dbRes) => {
  })
  res.redirect('/add-to-cart')
})

app.get('/dinein-takeaway', (req, res) => {
  res.render('dineintakeaway')
})

// complete order page
app.post('/complete-order/diner', (req, res) => {
  diner = req.body.name
  dinerTable = req.body.table
  dineTA = req.body.dineTA
  console.log(diner, dinerTable, dineTA)
  let sql2 = `select name,price,count(*) as "quantity" from orders group by name,price;`
  db.query(sql2, (err, dbRes) => {
    let complete = dbRes.rows
    res.render('complete', { complete: complete, diner: diner, dinerTable: dinerTable, dineTA: dineTA })
  })
})

// Only for ADMIN
app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  bcrypt.hash(password, saltRounds, function (err, hash) {
    let sql = `insert into users (email, password_digest) values ($1, $2);`
    db.query(sql, [email, hash], (err, dbRes) => {
    })
  })
  res.redirect('/login')
})

// Login only for ADMIN
app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  const sql = `select * from users where email = $1;`
  db.query(sql, [req.body.email], (err, dbRes) => {
    if (err) {
      console.log(err)
    }
    if (dbRes.rows.length === 0) {
      return res.render('login')
    }
    let user = dbRes.rows[0]
    console.log(user)
    bcrypt.compare(req.body.password, user.password_digest, (err, result) => {
      console.log(result)
      if (result) {
        req.session.userId = user.id
        res.redirect('/staff_dashboard')
      } else {
        res.render('login')
      }
    })
  })
})

// Logout Admin
app.delete('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
})

app.listen(port)

