CREATE DATABASE ordertogo;

CREATE TABLE menu (
  id SERIAL PRIMARY KEY,
  name TEXT,
  image_url TEXT,
  description TEXT,
  price INT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name TEXT,
  price INT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT,
  password_digest TEXT
);

CREATE TABLE diners (
  id SERIAL PRIMARY KEY,
  name TEXT,
  phone_number INT,
  table_no INT
);

INSERT INTO menu (name, image_url, description, price)
VALUES ('cake', 'https://preppykitchen.com/wp-content/uploads/2019/06/Chocolate-cake-recipe-1200a.jpg');

INSERT INTO dishes (name, image_url)
VALUES ('pudding', 'https://storcpdkenticomedia.blob.core.windows.net/media/recipemanagementsystem/media/recipe-media-files/recipes/retail/desktopimages/rainbow-cake600x600_2.jpg');

INSERT INTO dishes (name, image_url)
VALUES ('cake', 'https://livforcake.com/wp-content/uploads/2017/07/black-forest-cake-thumb-500x500.jpg');

INSERT INTO users (email, password_digest)
VALUES ('aiman@gmail.com', 'hello');

   <form action="">
          <input type="number" placeholder="quantity" id="<%=o.id%> " name="quantity" value="">
        </form>

        So still use the idea of add to cart

            // for (i = 0; i < order.length; i++) {
    //   arr.push(order[i])
    // }
    // console.log(arr.length)

    // Admin page - to add product after sign up - they can get to this page
// app.get('/add-product', (req, res) => {
//   res.render('add-product')
// })

// Having the server to put in all the data fill from the form in /add menu page
// app.post('/add-product', (req, res) => {
//   sql = `insert into menu (name, image_url, price, description) values ($1, $2, $3, $4);`
//   db.query(sql, [req.body.name, req.body.image_url, req.body.price, req.body.description], (err, dbRes) => {
//     res.redirect('/')
//   })
// })

// app.post('/staff_dashboard', (req, res) => {
//   sql = `insert into menu (name, image_url, price, description) values ($1, $2, $3, $4);`
//   db.query(sql, [req.body.name, req.body.image_url, req.body.price, req.body.description], (err, dbRes) => {
//   })
// })

                      <!-- <th>
                        <form action="/reduce-cart/<%= o.name %>" method="post">
                          <input type="hidden" name="_method" value="delete">
                          <button>reduce quantity</button>
                        </form>
                      </th>
                      <th>
                        <form action="/add-to-cart/<%= o.name %>">
                          <button>add quantity</button>
                        </form>
                      </th> -->

psql -d database -U  user -W
\c dbname username
\l
\dt
\dn