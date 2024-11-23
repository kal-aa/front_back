import mysql from "mysql2";
import bcrypt, { hash } from "bcrypt";
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
    return res
      .status(400)
      .send("Please enter full_name, gender, and age for the client");
  }
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    return res.status(400).send("Please provide both first name and last name");
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
      return res.status(500).send("Internal Server Error");
    }
    console.log(result);
    res.send("Data inserted successfully!");
  });
};

//  POST >>
//  INSERT INTO
//   /fb/insert-address
export const insertAddress = (req, res, next) => {
  if (!req.body.password || !req.body.email || !req.body.full_name) {
    console.log("Please add email, password and full_name");
    return res.status(400).send("Please add email, password and full_name");
  }
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?`;
  const addressSql = `INSERT INTO addresses (email, password, client_id) VALUES (?, ?, ?)`;

  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    return res.status(400).send("Please provide both first name and last name");
  }

  db.query(idSql, fullName, (err, result) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
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
        return res.status(500).send("Internal Server Error");
      }

      const hashedPassword = hash;
      const values = [email, hashedPassword, client_id];
      db.query(addressSql, values, (err, result) => {
        if (err) {
          console.error("Error fetching client:", err);
          return res.status(500).send("Internal Server Error");
        }
        console.log(result);
        res.send("Great You've got the hang of it!");
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
    return res
      .status(400)
      .send("Please insert your password, order_name, and quantity");
  }
  const orderName = req.body.order_name;
  const quantity = req.body.quantity;
  const password = req.body.password;
  const getAddressesSql = `SELECT * FROM addresses`;
  const orderSql = `INSERT INTO orders SET order_name = ?, quantity = ?, client_id = ?, address_id = ?`;
  db.query(getAddressesSql, (err, addressesResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
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
              return res.status(500).send("Internal Server Error");
            }

            console.log(orderResult);
          });
          return res.send("order added successfully!");
        }
      }
      console.log("Password doesn't match or the client doesn't exist");
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
    return res.status(400).send("Please insert your full name");
  }
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    return res.status(400).send("Please provide both first name and last name");
  }

  let sql;
  let values;
  if (req.query.column) {
    const column = req.query.column.trim().split(", ");
    sql = `SELECT ${column
      .map((each) => "??")
      .join(", ")} FROM clients WHERE first_name = ? AND last_name = ?`;
    values = [...column, fullName[0], fullName[1]];
  } else {
    sql = `SELECT * FROM clients WHERE first_name = ? AND last_name = ?`;
    values = [fullName[0], fullName[1]];
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
    }
    if (result.length === 0) {
      console.error("No client Found");
      return res.status(400).send("Make sure The name is Valid");
    }
    const row = result[0];
    const fullName = `${row.first_name} ${row.last_name}`;
    const gender = row.gender || "Unset";
    const age = row.age || "Unset";

    const newResult = { fullName, age, gender };

    console.log(result);
    res.send(newResult);
  });
};

//  READ >>
//  SELECT *
//  fb/select-address
export const selectAddress = (req, res, next) => {
  if (!req.query.full_name || !req.query.password) {
    console.log("Please insert your full name and password");
    return res.status(400).send("Please insert your full name and password");
  }
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name");
    return res.status(400).send("Please provide both first name and last name");
  }

  const inputPassword = req.query.password;
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const addressSql = `SELECT * FROM addresses WHERE client_id = ?`;

  db.query(idSql, [fullName[0], fullName[1]], (err, idResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
    }
    const id = idResult[0]?.id;
    if (!id) {
      console.error("No client found");
      return res
        .status(404)
        .send(
          `Oops! NO client found with the name "${fullName[0]} ${fullName[1]}"`
        );
    }

    db.query(addressSql, [id], (err, addressResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (addressResult.length === 0) {
        console.error("No address found");
        return res
          .status(404)
          .send(
            `Oops! No address found with the name "${fullName[0]} ${fullName[1]}"`
          );
      }

      const sqlPassword = addressResult[0].password;
      bcrypt.compare(inputPassword, sqlPassword, (err, result) => {
        if (err) {
          console.error("Error comparing password:", err);
          return res.status(500).send("Internal Server Error");
        }
        if (!result) {
          console.error("Password Doesn't match");
          return res.status(401).send("Incorrect password");
        }

        console.log("Password Match!");
        const email = addressResult[0].email;
        const emailPassword = inputPassword;
        const newResult = { email, emailPassword };

        console.log(addressResult);
        res.send(newResult);
      });
    });
  });
};

//  READ >>
//  SELECT *
//  fb/select-order
export const selectOrder = (req, res, next) => {
  if (!req.query.full_name) {
    console.log("Add your full name");
    return res.status(400).send("Add your full name");
  }
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const addressSql = `SElECT * FROM addresses WHERE client_id = ?`;
  const orderSql = `SELECT * FROM orders WHERE client_id = ?`;

  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Please add your full name, like:John Doe");
    return res.status(400).send("Please provide both first name and last name");
  }

  db.query(idSql, fullName, (err, idResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
    }
    if (idResult.length === 0) {
      console.log(
        "user trying to fetch an order with a client name that doesn't exist"
      );
      return res
        .status(404)
        .send(
          "Oops!, No client found with the name:" +
            "'" +
            fullName[0] +
            " " +
            fullName[1] +
            "'"
        );
    }

    const id = idResult[0]?.id;

    db.query(addressSql, [id], (err, addressResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (addressResult.length === 0) {
        console.log(
          "user trying to fetch an order for a client which doesn't have an address"
        );
        return res
          .status(404)
          .send(
            "Please fill the Address form and then place an order first to see your orders"
          );
      }

      db.query(orderSql, [id], (err, orderResult) => {
        if (err) {
          console.error("Error fetching client:", err);
          return res.status(500).send("Internal Server Error");
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
    return res.status(400).send("no full_name and password added");
  }
  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("full name length !== 2");
    return res.status(400).send("Please insert your full name");
  }
  const sql = `
    SELECT * FROM clients c 
    JOIN addresses a 
      ON c.id = a .client_id 
    JOIN orders o
      ON c.id = o.client_id
    WHERE first_name = ? AND last_name = ?;`;

  db.query(sql, fullName, (err, sqlResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
    }
    if (sqlResult.length === 0) {
      console.error(
        "can't fetch data from all the 3 tables with the name user gave, since one, two, or three of them are empty"
      );
      return res
        .status(404)
        .send(
          `Oops! incorrect name: ${fullName[0]} ${fullName[1]}, or doesn't have a full info!`
        );
    }

    const sqlPassword = sqlResult[0].password;
    bcrypt.compare(inputPassword, sqlPassword, (err, result) => {
      if (err) {
        console.error("Error comparing password:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (!result) {
        console.error("Incorrect Password");
        return res.status(401).send("Please insert a correct password");
      }

      console.log("Password Match!");

      const row = sqlResult[0];
      const fullName = `${row.first_name} ${row.last_name}`;
      const age = row.age || "Unset";
      const gender = row.gender || "Unset";
      const email = row.email;
      const password = inputPassword;
      const order = `${row.quantity} ${row.order_name}(s)`;

      const newResult = {
        fullName,
        age,
        gender,
        email,
        password,
        order,
      };

      console.log(sqlResult);
      res.send(newResult);
    });
  });
};

//  UPDATE
//  UPDATE clients SET...
//  fb/update-client
export const updateClient = (req, res, next) => {
  /* for the frontend add a SELECT * and put the data inside form making it ready to update */

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
    if (fullName.length !== 2) {
      console.log("Please enter your full name");
      return res.status(400).send('Enter your full name like: "John Doe"');
    }
    if (isNaN(age)) {
      console.log("The age Must be a number");
      return res.status(400).send("Age must be number");
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
        return res.status(500).send("Internal Server Error");
      }
      if (result.length === 0) {
        console.log("Put a valid name");
        return res
          .status(404)
          .send(`No data with the name ${prevFullName[0]} ${prevFullName[1]}`);
      }

      db.query(sql, updateValues, (err, result) => {
        if (err) {
          console.error("Error fetching client:", err);
          return res.status(500).send("Internal Server Error");
        }

        console.log("Updated successfully");
        return res.send("Updated");
      });
    });
  } else {
    console.log(
      "PrevFull_name new_age, new_gender and newFull_name not filled"
    );
    return res
      .status(400)
      .send(
        "Please add your previous full name and the new age, gender and full name"
      );
  }
};

//  UPDATE
//  UPDATE addresses SET...
//  fb/update-address
export const updateAddress = (req, res, next) => {
  if (
    !req.body.new.email ||
    !req.body.new_password ||
    !req.body.prev_password ||
    !req.body.full_ame
  ) {
    console.log("Add full_name, prev_password, new_password, new_email");
    return res.status(400).send("Add all info");
  }
  const fullName = req.body.full_name.trim().split(" ");
  const prevPassword = req.body.prev_password;
  const newPassword = req.body.new_password;
  const newEmail = req.body.new_email;
  const idSql = `SELECT id FROM clients WHERE first_name = ? AND last_name = ?;`;
  const checkAddress = `SELECT * FROM addresses WHERE client_id = ?`;
  const addressSql = `UPDATE addresses SET email = ?, password = ? WHERE client_id = ?`;

  //  check if the client exists
  db.query(idSql, fullName, (err, idResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return res.status(500).send("Internal Server Error");
    }
    const id = idResult[0]?.id;
    if (!id) {
      console.log("No client found, to update the address");
      return res
        .status(404)
        .send(`Client with a name: "${fullName[0]} ${fullName[1]}" not found`);
    }

    //  check if the address exists for the client
    db.query(checkAddress, [id], (err, checkResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (checkResult.length === 0) {
        console.log("No address Found to be updated");
        return res
          .status(404)
          .send(`No address found related to: "${fullName[0]} ${fullName[1]}"`);
      }

      // check if the users id matches with the one in the address
      bcrypt.compare(
        prevPassword,
        checkResult[0].password,
        (err, passwordResult) => {
          if (err) {
            console.error("Error comparing password:", err);
            return res.status(500).send("Internal Server Error");
          }
          if (!passwordResult) {
            console.log("password doesn't match");
            return res.status(401).send("password doesn't match");
          } else {
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
  if (!req.query.password || !req.query.full_name) {
    console.log("Add your password and full name");
    return res.status(400).send("Please insert your password");
  }
  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("Add your full name, like: 'John Doe' to be deleted");
    return res.status(400).send("Add your full name, like: 'John Doe'");
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
      return res.status(500).send("Internal Server Error");
    }
    const id = clientResult[0]?.id;
    if (!id) {
      console.log("The client to be deleted was not found");
      return res.status(404).send("The client name you entered was not found!");
    }

    //  check if the client has an order
    db.query(orderSql, [id], (err, orderResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return res.status(500).send("Internal Server Error");
      }
      if (orderResult.length === 0) {
        console.log("The client has no order to be deleted");
        return;
      }

      //  Delete the order
      db.query(deleteOrderSql, [id], (err, deleteOrderResult) => {
        if (err) {
          console.error("Error fetching client:", err);
          return res.status(500).send("Internal Server Error");
        }

        console.log("Order deleted:", deleteOrderResult);

        // Check if the client has an address
        db.query(addressSql, [id], (err, addressResult) => {
          if (err) {
            console.error("Error fetching client:", err);
            return res.status(500).send("Internal Server Error");
          }
          if (addressResult.length === 0) {
            console.log("The client has no address to be deleted");
            return;
          }

          //  compare the password
          const sqlPassword = addressResult[0]?.password;
          bcrypt.compare(inputPassword, sqlPassword, (err, compareResult) => {
            if (err) {
              console.error("Error comparing password:", err);
              return res.status(500).send("Internal Server Error");
            }
            if (!compareResult) {
              console.log("Password doesn't match");
              return res.status(401).send("Password doesn't match");
            }

            //  Delete the address
            db.query(deleteAddressSql, [id], (err, deleteAddressResult) => {
              if (err) {
                console.error("Error fetching client:", err);
                return res.status(500).send("Internal Server Error");
              }
              console.log("Address deleted:", deleteAddressResult);

              //  The finally delete the client
              db.query(deleteClientSql, [id], (err, deleteClientResult) => {
                if (err) {
                  console.error("Error fetching client:", err);
                  return res.status(500).send("Internal Server Error");
                }
                console.log("Client deleted:", deleteClientResult);
                return res.send(`We will miss you ${fullName[0]}`);
              });
            });
          });
        });
      });
    });
  });
};
