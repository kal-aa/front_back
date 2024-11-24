import mysql from "mysql2";
import bcrypt, { hash } from "bcrypt";
import comparePassword from "../reUses/comparePassword.js";
import noFullName from "../reUses/noFullName.js";
const db = mysql.createConnection({
  user: "kalab",
  host: "localhost",
  password: "kalab1597",
  database: "Front_Back",
});

//  POST >>
//  INSERT INTO
//  /fb/insert-client
export const insertClient = (req, res, next) => {
  const sql = "INSERT INTO clients SET ?";
  const gender = req.body.gender || null;
  const age = req.body.age || null;
  if (!req.body.full_name) {
    console.log("Please enter full_name, gender, and age for the client");
    const err = new Error(
      "Please enter full_name, gender, and age for the client"
    );
    err.status = 400;
    return next(err);
  }
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    const err = new Error("Please provide both first name and last name");
    err.status = 400;
    return next(err);
  }

  const values = {
    first_name: fullName[0],
    last_name: fullName[1],
    gender,
    age,
  };
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    console.log(result);
    res.status(201).end();
  });
};

//  POST >>
//  INSERT INTO
//   /fb/insert-address
export const insertAddress = (req, res, next) => {
  if (!req.body.password || !req.body.email || !req.body.full_name) {
    console.log("Please add email, password and full_name");
    const err = new Error("Please add email, password and full_name");
    err.status = 400;
    return next(err);
  }
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?`;
  const addressSql = `INSERT INTO addresses (email, password, client_id) VALUES (?, ?, ?)`;

  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    const err = new Error("Please provide both first name and last name");
    err.status = 400;
    return next(err);
  }

  db.query(idSql, fullName, (err, result) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    const client_id = result[0]?.id;
    if (!client_id) {
      console.log(
        `No client found with the name: ${fullName[0]} ${fullName[1]}`
      );
      return res.status(404).send(`NOT found`);
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error("Error comparing password:", err);
        return next(new Error());
      }

      const hashedPassword = hash;
      const values = [email, hashedPassword, client_id];
      db.query(addressSql, values, (err, result) => {
        if (err) {
          console.error("Error fetching client:", err);
          return next(new Error());
        }
        console.log(result);
        res.status(201).end();
      });
    });
  });
};

//  POST >>
//  INSERT INTO
//   /fb/insert-order
export const insertOrder = (req, res, next) => {
  if (!req.body.password || !req.body.order_name || !req.body.quantity) {
    console.log("Please insert your password, order_name, and quantity");
    const error = new Error(
      "Please insert your password, order_name, and quantity"
    );
    error.status = 400;
    return next(error);
  }
  const orderName = req.body.order_name;
  const quantity = req.body.quantity;
  const password = req.body.password;
  const getAddressesSql = `SELECT * FROM addresses`;
  const orderSql = `INSERT INTO orders SET order_name = ?, quantity = ?, client_id = ?, address_id = ?`;
  db.query(getAddressesSql, (err, addressesResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }

    const comparePasswords = async (addressesResultArray, inputPassword) => {
      for (const each of addressesResultArray) {
        const isMatch = await bcrypt.compare(inputPassword, each.password);
        if (isMatch) {
          console.log("Matched");
          const client_id = each.client_id;
          const address_id = each.address_id;
          const values = [orderName, quantity, client_id, address_id];

          db.query(orderSql, values, (err, orderResult) => {
            if (err) {
              console.error("Error fetching client:", err);
              return next(new Error());
            }

            console.log(orderResult);
          });
          return res.status(201).end();
        }
      }
      console.log("Password doesn't match or the client doesn't exist");
      const err = new Error(
        "Password doesn't match or the client doesn't exist"
      );
      err.status = 401;
      return next(err);
    };
    comparePasswords(addressesResult, password);
  });
};

//  READ >>
//  SELECT *
//  fb/select-client
export const selectClient = (req, res, next) => {
  if (!req.query.full_name) {
    console.log("Please insert your full name");
    const error = new Error("Please insert your full name");
    error.status = 400;
    return next(error);
  }
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    const error = new Error("Please provide both first name and last name");
    error.status = 400;
    return next(error);
  }

  const sql = `SELECT * FROM clients WHERE first_name = ? AND last_name = ?`;
  const values = [fullName[0], fullName[1]];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    if (result.length === 0) {
      console.error("No client Found");
      const error = new Error("Make sure The name is Valid");
      error.status = 400;
      return next(error);
    }

    const row = result[0];
    const fullName = `${row.first_name} ${row.last_name}`;
    const gender = row.gender || "Unset";
    const age = row.age || "Unset";

    const newResult = { fullName, age, gender };

    console.log(result);
    return res.send(newResult);
  });
};

//  READ >>
//  SELECT *
//  fb/select-address
export const selectAddress = (req, res, next) => {
  if (!req.query.full_name || !req.query.password) {
    console.log("Please insert your full name and password");
    const err = new Error("Please insert your full name and password");
    err.status = 400;
    return next(err);
  }
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    const err = new Error("Please provide both first name and last name");
    err.status = 400;
    return next(err);
  }

  const inputPassword = req.query.password;
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const addressSql = `SELECT * FROM addresses WHERE client_id = ?`;

  db.query(idSql, [fullName[0], fullName[1]], (err, idResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    const id = idResult[0]?.id;
    if (!id) {
      console.error("No client found");
      const err = new Error(
        `Oops! NO client found with the name: ${fullName[0]} ${fullName[1]}`
      );
      return next(err);
    }

    db.query(addressSql, [id], (err, addressResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      if (addressResult.length === 0) {
        console.error("No address found");
        const err = new Error(
          `Oops! No address found with the name: ${fullName[0]} ${fullName[1]}`
        );
        err.status = 404;
        return next(err);
      }

      const sqlPassword = addressResult[0].password;
      comparePassword(inputPassword, sqlPassword, isResult, next);
      function isResult() {
        console.log("Password Match!");
        const email = addressResult[0].email;
        const emailPassword = inputPassword;
        const newResult = { email, emailPassword };

        console.log(addressResult);
        res.send(newResult);
      }
    });
  });
};

//  READ >>
//  SELECT *
//  fb/select-order
export const selectOrder = (req, res, next) => {
  if (!req.query.full_name) {
    console.log("Add your full name");
    const err = new Error("Add your full name");
    err.status = 400;
    return next(err);
  }
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const addressSql = `SElECT * FROM addresses WHERE client_id = ?`;
  const orderSql = `SELECT * FROM orders WHERE client_id = ?`;

  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name, like:John Doe");
    const err = new Error("Please provide both first name and last name");
    err.status = 400;
    return next(err);
  }

  // Check if the client exists at the first place
  db.query(idSql, fullName, (err, idResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    if (idResult.length === 0) {
      console.log(
        "user trying to fetch an order with a client name that doesn't exist"
      );
      const err = new Error(
        `Oops!, no client found with the name ${fullName[0]} ${fullName[1]}`
      );
      err.status = 404;
      return next(err);
    }

    // Check if the user has an address
    const id = idResult[0]?.id;
    db.query(addressSql, [id], (err, addressResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      if (addressResult.length === 0) {
        console.log(
          "user trying to fetch an order for a client which doesn't have an address"
        );
        const err = new Error(
          "Please fill the Address form and then place an order first to see your orders"
        );
        err.status = 404;
        return next(err);
      }

      // Check if the user has placed an order
      db.query(orderSql, [id], (err, orderResult) => {
        if (err) {
          console.error("Error fetching client:", err);
          return next(new Error());
        }
        if (orderResult.length === 0) {
          console.error(
            "user trying to fetch an order without having an address"
          );
          const err = new Error(
            "You do not have an address and order, please add some and try again!"
          );
          return next(err);
        }

        const order = orderResult[0].order_name;
        const quantity = orderResult[0].quantity;
        const newResult = { order, quantity };
        console.log(orderResult);
        return res.send(newResult);
      });
    });
  });
};

//  READ >>
//  SELECT *
//  fb/select-all
export const selectAll = (req, res, next) => {
  if (!req.query.full_name || !req.query.password) {
    console.error("no full_name and password added");
    const err = new Error("Please add your full name and password");
    err.status = 400;
    return next(err);
  }

  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("full name length !== 2");
    const err = new Error("Please insert your full name");
    err.status = 400;
    return next(err);
  }
  const idSql = `SELECT * FROM clients WHERE first_name = ? AND last_name = ?;`;
  const orderSql = `SELECT * FROM orders WHERE client_id = ?;`;
  const addressSql = `SELECT * FROM addresses WHERE client_id = ?;`;
  const allSql = `
    SELECT * FROM clients c 
    JOIN addresses a 
      ON c.id = a .client_id 
    JOIN orders o
      ON c.id = o.client_id
    WHERE first_name = ? AND last_name = ?;`;

  // Check if the client exists
  db.query(idSql, fullName, (err, idResult) => {
    if (err) {
      console.error("Server Error");
      return next(new Error());
    }
    if (idResult.length === 0) {
      console.error("no client found");
      const err = new Error("No client found");
      err.status = 404;
      return next(err);
    }

    // Check if the client has an address
    const id = idResult[0]?.id;
    db.query(addressSql, [id], (err, addressResult) => {
      if (err) {
        console.error("Server error");
        return next(new Error());
      }
      if (addressResult.length === 0) {
        console.log("No address found, returned only the client");
        // As the address doesn't exist we should return only the client
        return res.send(idResult[0]);
      }

      const sqlPassword = addressResult[0]?.password;
      // call the comparePassword function and set it up
      comparePassword(inputPassword, sqlPassword, ifResult, next);
      function ifResult() {
        // Check if an order exists
        db.query(orderSql, [id], (err, orderResult) => {
          if (err) {
            console.error("Internal server Error");
            return next(new Error());
          }
          if (orderResult.length === 0) {
            console.error("No order found");
            const err = new Error("You have not added any order yet");
            err.status = 404;
            return next(err);
          }

          // Since we know all the three rows exist get them
          const idRow = idResult[0];
          const addressRow = addressResult[0];
          const orderRow = orderResult[0];

          return res.send([idRow, addressRow, orderRow]);
        });
      }
    });
  });
};

//  UPDATE
//  UPDATE clients SET...
//  fb/update-client
export const updateClient = (req, res, next) => {
  /* for the frontend add first fetch data from the selectClient and fill the form with it, making it ready to update */

  if (
    req.body.newFull_name &&
    req.body.prevFull_name &&
    req.body.new_age &&
    req.body.new_gender
  ) {
    const prevFullName = req.body.prevFull_name.trim().split(" ");
    const age = req.body.new_age;
    const gender = req.body.newGender;
    const fullName = req.body.newFull_name.trim().split(" ");
    if (fullName.length !== 2 || prevFullName.length !== 2) {
      console.error("Please enter your full name");
      const err = new Error("Enter your full name like: John Doe");
      err.status = 200;
      return next(err);
    }
    if (isNaN(age)) {
      console.error("The age Must be a number");
      const err = new Error("Age must be a number");
      err.status = 400;
      return next(err);
    }

    const checkSql = `SELECT * FROM clients WHERE first_name = ? AND last_name = ?`;
    const checkValues = [prevFullName[0], prevFullName[1]];

    const sql = `UPDATE clients SET first_name = ?, last_name = ?, gender = ?, age = ? WHERE first_name = ? AND last_name = ?`;
    const updateValues = [
      fullName[0],
      fullName[1],
      gender,
      age,
      prevFullName[0],
      prevFullName[1],
    ];

    db.query(checkSql, checkValues, (err, result) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      if (result.length === 0) {
        console.error("Put a valid name");
        const err = new Error(
          `No data with the name ${prevFullName[0]} ${prevFullName[1]}`
        );
        err.status = 404;
        return next(err);
      }

      db.query(sql, updateValues, (err, result) => {
        if (err) {
          console.error("Error fetching client:", err);
          return next(new Error());
        }

        console.log("Updated successfully");
        return res.status(204).end();
      });
    });
  } else {
    console.error(
      "PrevFull_name new_age, new_gender and newFull_name not filled"
    );
    const err = new Error(
      "Please add your previous full name and the new age, gender and full name"
    );
    err.status = 400;
    return next(err);
  }
};

//  UPDATE
//  UPDATE addresses SET...
//  fb/update-address
export const updateAddress = (req, res, next) => {
  if (
    !req.body.email ||
    !req.body.new_password ||
    !req.body.prev_password ||
    !req.body.full_name
  ) {
    console.error("Add full_name, prev_password, new_password, new_email");
    const err = new Error("Add all info");
    err.status = 400;
    return next(err);
  }
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("Please insert your full name");
    const err = new Error("Please add your full name in order to update");
    err.status = 404;
    return next(err);
  }
  const inputPassword = req.body.prev_password;
  const newPassword = req.body.new_password;
  const newEmail = req.body.email;
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const checkAddress = `SELECT * FROM addresses WHERE client_id = ?`;
  const addressSql = `UPDATE addresses SET email = ?, password = ? WHERE client_id = ?`;

  //  check if the client exists
  db.query(idSql, fullName, (err, idResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    const id = idResult[0]?.id;
    if (!id) {
      console.error("No client found, to update the address");
      const err = new Error(
        `Client with a name: "${fullName[0]} ${fullName[1]}" not found`
      );
      err.status = 404;
      return next(err);
    }

    //  check if the address exists for the client
    db.query(checkAddress, [id], (err, checkResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      if (checkResult.length === 0) {
        console.error("No address Found to be updated");
        const err = new Error(
          `No address found related to: "${fullName[0]} ${fullName[1]}"`
        );
        err.status = 404;
        return next(err);
      }

      // check if the users id matches with the one in the address
      const sqlPassword = checkResult[0].password;

      comparePassword(inputPassword, sqlPassword, ifResult, next);
      function ifResult() {
        // Generate a new hashed password for the new email
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Internal Server Error");
          }

          // finally update the address with the new email and hashed password
          const values = [newEmail, hashedPassword, id];
          db.query(addressSql, values, (err, result) => {
            if (err) {
              console.error("Error fetching client:", err);
              return res.status(500).send("Internal Server Error");
            }

            console.log("Done");
            return res.status(204).end();
          });
        });
      }
    });
  });
};

//  DELETE
//  DELETE client FROM...
//  fb/delete-client
export const deleteClient = (req, res, next) => {
  if (!req.query.password || !req.query.full_name) {
    console.log("Add your password and full name");
    const err = new Error("Please insert password and full name");
    err.status = 400;
    return next(err);
  }
  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("Add your full name, like: 'John Doe' to be deleted");
    const err = new Error("Add your full name, like: John Doe");
    err.status = 400;
    return next(err);
  }
  const clientSql = `SELECT id FROM clients WHERE first_name = ? AND  last_name = ?`;
  const deleteClientSql = `DELETE FROM clients WHERE id = ?`;
  const addressSql = `SELECT * FROM addresses WHERE client_id = ?`;
  const deleteAddressSql = `DELETE FROM addresses WHERE client_id = ?`;
  const orderSql = `SELECT * FROM orders WHERE client_id = ?`;
  const deleteOrderSql = `DELETE FROM orders WHERE client_id = ?`;

  // first fetch the client id from clients table
  db.query(clientSql, fullName, (err, clientResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    const id = clientResult[0]?.id;
    if (!id) {
      console.error("The client to be deleted was not found");
      const err = new Error("The client name you entered was not found!");
      err.status = 404;
      return next(err);
    }

    //  check if the client has an order
    db.query(orderSql, [id], (err, orderResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      if (orderResult.length === 0) {
        console.error("The client has no order to be deleted");
        return;
      }

      //  Delete the order
      db.query(deleteOrderSql, [id], (err, deleteOrderResult) => {
        if (err) {
          console.error("Error fetching client:", err);
          return next(new Error());
        }

        console.log("Order deleted:", deleteOrderResult);

        // Check if the client has an address
        db.query(addressSql, [id], (err, addressResult) => {
          if (err) {
            console.error("Error fetching client:", err);
            return next(new Error());
          }
          if (addressResult.length === 0) {
            console.error("The client has no address to be deleted");
            return;
          }

          //  compare the password
          const sqlPassword = addressResult[0]?.password;
          comparePassword(inputPassword, sqlPassword, ifResult, next);
          function ifResult() {
            //  Delete the address
            db.query(deleteAddressSql, [id], (err, deleteAddressResult) => {
              if (err) {
                console.error("Error fetching client:", err);
                return next(new Error());
              }
              console.log("Address deleted:", deleteAddressResult);

              //  The finally delete the client
              db.query(deleteClientSql, [id], (err, deleteClientResult) => {
                if (err) {
                  console.error("Error fetching client:", err);
                  return next(new Error());
                }
                console.log("Client deleted:", deleteClientResult);
                return res.status(204).end();
              });
            });
          }
        });
      });
    });
  });
};
