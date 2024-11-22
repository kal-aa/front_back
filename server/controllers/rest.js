import mysql from "mysql2";
import bcrypt, { hash } from "bcrypt";
const db = mysql.createConnection({
  user: "kalab",
  host: "localhost",
  password: "kalab1597",
  database: "Front_Back",
});

//  POST
//  INSERT INTO
//  /fb/insert-client
export const insertClient = (req, res, next) => {
  const sql = "INSERT INTO clients SET ?";
  const values = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    age: req.body.age,
  };

  db.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Data inserted successfully!");
  });
};

//  POST
//  INSERT INTO
//   /fb/insert-address
export const insertAddress = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) throw err;
    console.log("Hashed password:", hash);
    const hashedPassword = hash;

    const idSql = `SELECT id FROM clients WHERE first_name = ?`;
    const addressSql = `
      INSERT INTO addresses (email, password, client_id) 
      VALUES (?, ?, ?)
    `;

    db.query(idSql, [req.body.first_name], (err, result) => {
      if (err) throw err;

      const client_id = result[0]?.id;
      if (!client_id) {
        return res.status(404).send(`NOT found`);
      }

      const values = [req.body.email, hashedPassword, client_id];
      db.query(addressSql, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Great You've got the hang of it!");
      });
    });
  });
};

//  POST
//  INSERT INTO
//   /fb/insert-order
export const insertOrder = (req, res, next) => {
  const getClientSql = `SELECT id FROM clients WHERE first_name = ?`;
  const getAddressSql = `SELECT address_id FROM addresses WHERE client_id = ? LIMIT 1`;
  const insertOrderSql = `INSERT INTO orders (order_name, quantity, client_id, address_id) VALUES (?, ?, ?, ?)`;

  db.query(getClientSql, [req.body.first_name], (err, clientResult) => {
    if (err) {
      console.log("Error fetching client ID:", err);
      return res.status(500).send("Error processing request");
    }

    const clientId = clientResult[0]?.id;
    if (!clientId) {
      return res.status(400).send("client Not found");
    }

    db.query(getAddressSql, [clientId], (err, addressResult) => {
      if (err) {
        console.log("Error fetching address ID:", err);
        return res.status(500).send("Error processing request");
      }

      const addressId = addressResult[0]?.address_id;
      if (!addressId) {
        return res.status(400).send("Please fill the Address form first!");
      }

      const values = [
        req.body.order_name,
        req.body.quantity,
        clientId,
        addressId,
      ];
      db.query(insertOrderSql, values, (err, result) => {
        if (err) {
          console.log("Error inserting order:", err);
          return res.status(500).send("Error creating order");
        }
        console.log(result);
        res.send("Order created successfully");
      });
    });
  });
};

//  READ
//  SELECT *
//  fb/select-client
export const selectClient = (req, res, next) => {
  let sql;
  let values;
  if (req.body.column) {
    sql = `SELECT ?? FROM clients WHERE first_name = ?`;
    values = [req.body.column, req.body.first_name];
  } else {
    sql = `SELECT * FROM clients WHERE first_name = ?`;
    values = [req.body.first_name];
  }

  db.query(sql, values, (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      return res.status(400).send("Make sure The name is Valid");
    }
    const row = result[0];
    const full_name = `${row.first_name} ${row.last_name}`;
    const gender = row.gender || "Unset";
    const age = row.age || "Unset";

    const newResult = { full_name, age, gender };
    console.log(newResult);
    res.send(newResult);
  });
};

//  READ
//  SELECT *
//  fb/select-address
export const selectAddress = (req, res, next) => {
  const idSql = `SELECT id FROM clients WHERE first_name = ?;`;
  const addressSql = `
    SELECT * FROM addresses WHERE client_id = ? LIMIT 1;`;
  const first_name = req.body.first_name;

  db.query(idSql, [first_name], (err, idResult) => {
    if (err) throw err;

    const id = idResult[0]?.id;
    if (!id) {
      return res
        .status(404)
        .send(`Oops! NO client with the name "${first_name}"`);
    }

    db.query(addressSql, [id], (err, addressResult) => {
      if (err) throw err;

      if (!addressResult.length) {
        return res
          .status(404)
          .send(`Oops! No address found with the name "${first_name}"`);
      }

      const password = addressResult[0].password;
      bcrypt.compare(req.body.password, password, (err, result) => {
        if (err) throw err;
        if (!result) {
          console.log("Password Doesn't match");
          return res.status(401).send("Incorrect password");
        }

        console.log("Password Match!");
        const email = addressResult[0].email;
        const emailPassword = req.body.password;
        const newResult = { email, emailPassword };

        res.send(newResult);
      });
    });
  });
};

//  READ
//  SELECT *
//  fb/select-order
export const selectOrder = (req, res, next) => {
  if (!req.body.full_name) {
    console.log("Add your full name");
    return;
  }
  const fullName = req.body.full_name.trim().split(" ");

  if (fullName.length !== 2) {
    return res.status(400).send("Please provide both first name and last name");
  }

  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const orderSql = `SELECT * FROM orders WHERE client_id = ?`;

  db.query(idSql, fullName, (err, idResult) => {
    if (err) throw err;
    if (idResult.length === 0) {
      console.log("No such data");
      return res.status(404).send("Client not found");
    }

    const id = idResult[0]?.id;
    db.query(orderSql, [id], (err, result) => {
      if (err) throw err;

      const order = result[0].order_name;
      const quantity = result[0].quantity;
      const newResult = { order, quantity };
      res.send(newResult);
    });
  });
};

//  READ
//  SELECT * FROM... JOIN ... JOIN
//` fb/select-all
export const selectAll = (req, res, next) => {
  if (req.body.full_name) {
    console.log("Add your full name");
    return;
  }
  const fullName = req.body.full_name.trim().split(" ");
  const sql = `
    SELECT * FROM clients c 
    JOIN addresses a 
      ON c.id = a .client_id 
    JOIN orders o
      ON c.id = o.client_id
    WHERE first_name = ? AND last_name = ?;`;

  if (fullName.length !== 2) {
    console.log("Please insert full name");
    return res.status(400).send("Please insert Full name");
  }

  db.query(sql, fullName, (err, sqlResult) => {
    if (err) throw err;
    if (sqlResult.length === 0) {
      console.log("No such name found");
      return res
        .status(404)
        .send(`Oops! incorrect name: ${fullName[0]} ${fullName[1]}`);
    }

    bcrypt.compare(req.body.password, sqlResult[0].password, (err, result) => {
      if (err) throw err;

      if (!result) {
        console.log("Incorrect Password");
        return res.status(401).send("Please insert a correct password");
      }

      console.log("Password Match!");

      const row = sqlResult[0];
      const fullName = `${row.first_name} ${row.last_name}`;
      const age = row.age || "Unset";
      const gender = row.gender || "Unset";
      const email = row.email;
      const password = req.body.password;
      const order = `${row.quantity} ${row.order_name}(s)`;

      const newResult = {
        fullName,
        age,
        gender,
        email,
        password,
        order,
      };

      console.log(newResult);
      res.send(newResult);
    });
  });
};

//  UPDATE
//  UPDATE clients SET...
//  fb/update-client
export const updateClient = (req, res, next) => {
  /* for the frontend add a SELECT * and put the data inside a PUT form */
  const firstName = req.body.first_name;
  if (req.body.full_name && req.body.age && req.body.gender && firstName) {
    const fullName = req.body.full_name.trim().split(" ");
    if (fullName.length !== 2) {
      console.log("Please enter your full name");
      return res.status(400).send('Enter your full name like: "John Doe"');
    }
    if (isNaN(req.body.age)) {
      console.log("The age Must be a number");
      return res.status(400).send("Age must be number");
    }

    const checkSql = `SELECT * FROM clients WHERE first_name = ?`;
    const value = [firstName];

    const sql = `UPDATE clients SET first_name = ?, last_name = ?, gender = ?, age = ? WHERE first_name = ?`;
    const values = [
      fullName[0],
      fullName[1],
      req.body.gender,
      req.body.age,
      firstName,
    ];

    db.query(checkSql, value, (err, result) => {
      if (err) throw err;
      if (result.length === 0) {
        console.log("Put a valid name");
        return res.status(404).send(`No data with the name ${fullName[0]}`);
      }

      db.query(sql, values, (err, result) => {
        if (err) throw err;

        console.log("Updated successfully");
        return res.send("Updated");
      });
    });
  } else {
    console.log("Please include age, gender and full_name");
    return;
  }
};

//  UPDATE
//  UPDATE addresses SET...
//  fb/update-address
export const updateAddress = (req, res, next) => {
  const firstName = req.body.first_name;
  const prevPassword = req.body.prev_password;
  const newPassword = req.body.new_password;
  const newEmail = req.body.new_email;
  if (!newEmail || !newPassword || !prevPassword || !firstName) {
    console.log("Add first_name, prev_password, new_password, new_email");
    return res.status(400).send("Add all info");
  }
  const idSql = `SELECT id FROM clients WHERE first_name = ?`;
  const checkAddress = `SELECT * FROM addresses WHERE client_id = ?`;
  const addressSql = `UPDATE addresses SET email = ?, password = ? WHERE client_id = ?`;

  //  check if the client exists
  db.query(idSql, [firstName], (err, idResult) => {
    if (err) throw err;
    const id = idResult[0]?.id;
    if (!id) {
      console.log("No data found");
      return res.status(404).send(`Data with a name: "${firstName}" not found`);
    }

    //  check if the address exists for the client
    db.query(checkAddress, [id], (err, checkResult) => {
      if (err) throw err;
      if (checkResult.length === 0) {
        console.log("No address Found");
        return res
          .status(404)
          .send(`No address found related to: ${firstName}`);
      }

      // check if the users id matches with the one in the address
      bcrypt.compare(
        prevPassword,
        checkResult[0].password,
        (err, passwordResult) => {
          if (err) throw err;
          if (!passwordResult) {
            console.log("password doesn't match");
            return;
          } else {
            // Generate a new hashed password for the new email
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
              if (err) throw err;

              // finally update the address with the new email and hashed password
              const values = [newEmail, hashedPassword, id];
              db.query(addressSql, values, (err, result) => {
                if (err) throw err;

                console.log("Done");
                res.send("Glad to done this");
              });
            });
          }
        }
      );
    });
  });
};

//  DELETE
//  DELETE client FROM...
//  fb/delete-client
export const deleteClient = (req, res, next) => {
  if (!req.query.fullName) {
    console.log("Add your full name");
    return res.status(400).send("Please insert your full name");
  }
  const fullName = req.query.fullName.trim().split(" ");

  const checkId = `SELECT password FROM clients WHERE first_name = ? AND last_name = ?`;
  const orderSql = `DELETE FROM orders WHERE client_id = ?`;
  const addressSql = `DELETE FROM addresses WHERE client_id = ?`;
  const clientSql = `DELETE FROM clients WHERE id = ?`;

  db.query(checkId, fullName, (err, idResult) => {
    if (err) throw err;
    const id = idResult[0]?.id;
    if (!id) {
      console.log("no client found to delete");
    }

    /* Ask the user if he/she wants to remove all the child row */

    // Delete the child order, first if exists
    db.query(orderSql, [id], (err, orderResult) => {
      if (err) throw err;
      console.log(orderResult);
    });

    // Delete the child order, first if exists
    db.query(addressSql, [id], (err, addressResult) => {
      if (err) throw err;
      console.log(addressResult);
    });
    db.query(clientSql, [id], (err, clientResult) => {
      if (err) throw err;
      console.log(clientResult);
      res.send("Deleted successfully");
    });
  });
};
