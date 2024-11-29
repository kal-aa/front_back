import bcrypt from "bcrypt";
import createConnection from "../reUses/createConnection.js";
import comparePassword from "../middlewares/comparePassword.js";
import constErr from "../middlewares/constErr.js";
import hashPassword from "../middlewares/hashPassword.js";
import deleteWhetherOrNot from "../middlewares/deleteWhetherOrNot.js";
import checkClientSql from "../middlewares/checkClientSql.js";
import checkOrderSql from "../middlewares/checkOrderSql.js";
import checkAddressSql from "../middlewares/checkAddressSql.js";

const db = createConnection();

//  POST >>
//  INSERT INTO
//  /fb/insert-client
export const insertClient = (req, res, next) => {
  const { full_name, gender, age, password, email } = req.body;
  const reqGender = gender || null;
  const reqAge = age || null;
  if ((!full_name, !email, !password)) {
    console.log("Please enter full_name, email and password for the client");
    return constErr(
      400,
      "Please insert full_name, email and password for the client",
      next
    );
  }
  const fullName = full_name.trim().split(" ");
  if (fullName.length !== 2) {
    return constErr(400, "Please add your full name", next);
  }
  const clientSql = "INSERT INTO clients SET ?";
  const addressSql = `INSERT INTO addresses SET ?;`;

  //  Check if there Email client want to add doesn't match with the ones in the database
  function emailSqlF() {
    const emailSql = `SELECT email FROM addresses WHERE email = ?`;
    db.query(emailSql, [email], (err, emailResult) => {
      if (err) {
        console.error("Error fetcing email");
        return next(new Error());
      }
      if (emailResult.length >= 1) {
        console.error("This email already exists");
        return constErr(409, "This email already exists", next);
      }

      // if the email doesn't exist in the database add it
      clientSqlF();
    });
  }

  //  Add full_name, age, and gender to the clients table
  function clientSqlF() {
    // if the email doesn't exist in the database add it
    const clientValues = {
      first_name: fullName[0],
      last_name: fullName[1],
      gender: reqGender,
      age: reqAge,
    };
    db.query(clientSql, clientValues, (err) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }

      checkClientSql(fullName, next, (clientResult) => {
        hashPasswordF(clientResult);
      });
    });
  }

  // Hash the password
  function hashPasswordF(clientResult) {
    hashPassword(password, next, (hashedPassword) => {
      const addressValues = {
        email,
        password: hashedPassword,
        client_id: clientResult[0].id,
      };
      addressSqlF(clientResult, addressValues, hashedPassword);
    });
  }

  // Add email and password to the addresses table
  function addressSqlF(clientResult, addressValues, hashedPassword) {
    db.query(addressSql, addressValues, (err) => {
      if (err) {
        console.error("Error Posting an address:", err);
        return constErr(500, "Erorr posting an address", next);
      }

      const clientData = {
        ...clientResult[0],
        password: hashedPassword,
        email,
      };

      addressIdSqlF(email, clientData);
    });
  } //

  // send the address_id back to the client side for better routing
  function addressIdSqlF(email, clientData) {
    const address_id = `SELECT address_id FROM addresses WHERE email = ?;`;
    db.query(address_id, [email], (err, addressResult) => {
      if (err) {
        console.error("Error fetching address_id,:", err);
        return next(new Error());
      }

      console.log("Client data posted:", clientData);
      res.status(201).send({ address_id: addressResult[0].address_id });
    });
  }

  emailSqlF();
};

//  POST >>
//  INSERT INTO
//   /fb/insert-order
export const insertOrder = (req, res, next) => {
  if (
    !req.body.full_name ||
    !req.body.password ||
    !req.body.order_name ||
    !req.body.quantity
  ) {
    console.error(
      "Please insert your password, full_name, order_name, and quantity"
    );
    return constErr(
      400,
      "Please insert your password, full_name, order_name, and quantity",
      next
    );
  }
  const orderName = req.body.order_name;
  const quantity = req.body.quantity;
  const password = req.body.password;
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("add your full name");
    return constErr(400, "Add your full name like: John Doe", next);
  }
  const getAddressesSql = `SELECT * FROM addresses`;
  const orderSql = `INSERT INTO orders SET order_name = ?, quantity = ?, client_id = ?, address_id = ?`;

  checkClientSql(fullName, next, (idResult) => {
    const id = idResult[0]?.id;
    checkAddressSql(id, next, (addressResult) => {
      const sqlPassword = addressResult[0]?.password;
      comparePassword(password, sqlPassword, next, () => {
        const client_id = addressResult[0].client_id;
        const address_id = addressResult[0].address_id;
        const values = [orderName, quantity, client_id, address_id];
        db.query(orderSql, values, (err, orderResult) => {
          if (err) {
            console.error("Error fetching client:", err);
            return next(new Error());
          }

          console.log(orderResult);
          return res.status(201).end();
        });
      });
    });
  });
};

//  READ >>
//  SELECT *
//  fb/select-client
export const selectClient = (req, res, next) => {
  const { password, full_name } = req.query;
  if (!full_name || !password) {
    console.error("Please insert your full name and Password");
    return constErr(400, "Please insert your full name and password", next);
  }
  const fullName = full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.log("fullname.length !== 2");
    return constErr(
      400,
      "Please provide both first name and last name, like: John Doe",
      next
    );
  }

  checkClientSql(fullName, next, (idResult) => {
    const clients = idResult.map((result) => result.id);
    const placeholders = idResult.map(() => "?").join(", ");

    const addressesSql = `SELECT * FROM addresses  WHERE client_id in(${placeholders})`;
    db.query(addressesSql, clients, async (err, addressResult) => {
      if (err) {
        console.error("Error fetching addresses:", err);
        return next(new Error());
      }

      try {
        let passwordMatch = false;
        for (const each of addressResult) {
          const isMatch = await bcrypt.compare(password, each.password);
          if (isMatch) {
            passwordMatch = true;
            return res.send({ address_id: each.address_id });
          }
        }

        if (!passwordMatch) {
          console.error("Password doesn't match");
          return constErr(401, "Password doesn't match", next);
        }
      } catch (error) {
        console.error("Error Comparing password:", error);
        return next(new Error());
      }
    });
  });
};

//  READ >>
//  SELECT *
//  fb/select-order
export const selectOrder = (req, res, next) => {
  if (!req.query.full_name || !req.query.password) {
    console.error("Add your full name and password");
    return constErr(400, "Add your full name and password", next);
  }

  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("Please add your full name, like:John Doe");
    return constErr(400, "Please provide both first name and last name", next);
  }

  // Check if the client exists at the first place
  checkClientSql(fullName, next, (idResult) => {
    const id = idResult[0]?.id;

    checkAddressSql(id, next, (addressResult) => {
      // Check if the user has placed an order
      const sqlPassword = addressResult[0]?.password;
      comparePassword(inputPassword, sqlPassword, next, () => {
        checkOrderSql(id, next, (orderResult) => {
          const order = orderResult[0].order_name;
          const quantity = orderResult[0].quantity;
          const newResult = { order, quantity };
          console.log(orderResult);
          return res.send(newResult);
        });
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
    return constErr(400, "Please add your full name and password", next);
  }

  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("full name length !== 2");
    return constErr(
      400,
      "Please insert both your first_name and last_name",
      next
    );
  }
  const orderSql = `SELECT * FROM orders WHERE client_id = ?;`;
  const addressSql = `SELECT * FROM addresses WHERE client_id = ?;`;

  // Check if the client has an address
  function addressSqlF(idResult) {
    const id = idResult[0]?.id;
    db.query(addressSql, [id], (err, addressResult) => {
      if (err) {
        console.error("Error fetching data:", err);
        return next(new Error());
      }
      if (addressResult.length === 0) {
        console.error("No address found, returned only the client");
        // As the address doesn't exist we should return only the client
        return res.send(idResult[0]);
      }

      const sqlPassword = addressResult[0]?.password;
      comparePassword(inputPassword, sqlPassword, next, () => {
        checkOrderF(id, addressResult, idResult);
      });
    });
  }

  // Check if an order exists
  function checkOrderF(id, addressResult, idResult) {
    db.query(orderSql, [id], (err, orderResult) => {
      if (err) {
        console.error("Error fetching data:", err);
        return next(new Error());
      }
      if (orderResult.length === 0) {
        console.error("No order found and returned address and client");
        //  since the order doesn't exist we should return the address and the client to the user
        return res.send([idResult[0], addressResult[0]]);
      }

      // Since we know all the three rows exist get them
      const idRow = idResult[0];
      const addressRow = addressResult[0];
      const orderRow = orderResult[0];

      console.log("Data from all the three tables served to the client");
      return res.send([idRow, addressRow, orderRow]);
    });
  }

  // Check if the client exists by calling the checkClientSql middleware
  checkClientSql(fullName, next, (idResult) => {
    addressSqlF(idResult);
  });
};

//  UPDATE
//  UPDATE clients SET...
//  fb/update-client
export const updateClient = (req, res, next) => {
  /* for the frontend add first fetch data from the selectClient and fill the form with it, making it ready to update */

  if (!req.body.newFull_name || !req.body.prevFull_name) {
    console.error("PrevFull_name and newFull_name not filled");
    return constErr(
      400,
      "Please add your previous full name and new full name",
      next
    );
  }
  const prevFullName = req.body.prevFull_name.trim().split(" ");
  const age = req.body.new_age || null;
  const gender = req.body.new_gender || null;
  const newFullName = req.body.newFull_name.trim().split(" ");
  if (newFullName.length !== 2 || prevFullName.length !== 2) {
    console.error("Please enter your full name");
    return constErr(200, "Enter your full name like: John Doe", next);
  }
  if (isNaN(age)) {
    console.error("Age Must  a number");
    return constErr(400, "Age must be a number", next);
  }

  const sql = `UPDATE clients SET first_name = ?, last_name = ?, gender = ?, age = ? WHERE first_name = ? AND last_name = ?`;
  const updateValues = [
    newFullName[0],
    newFullName[1],
    gender,
    age,
    prevFullName[0],
    prevFullName[1],
  ];

  function checkSqlF() {
    db.query(sql, updateValues, (err, result) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }

      console.log("Updated successfully");
      return res.status(204).end();
    });
  }

  checkClientSql(prevFullName, next, () => {
    checkSqlF();
  });
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
    return constErr(
      400,
      "Add full_name, prev_password, new_password, email",
      next
    );
  }
  const fullName = req.body.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("Please insert your full name");
    return constErr(400, "Please insert your first_name and last_name", next);
  }
  const inputPassword = req.body.prev_password;
  const newPassword = req.body.new_password;
  const newEmail = req.body.email;
  const addressSql = `UPDATE addresses SET email = ?, password = ? WHERE client_id = ?;`;

  function updateAddress(values) {
    db.query(addressSql, values, (err, result) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }

      console.log("Address updated! for the user:", fullName[0], fullName[1]);
      return res.status(204).end();
    });
  }

  //  check if the client exists
  checkClientSql(fullName, next, (idResult) => {
    //  check if the address exists for the client
    const id = idResult[0]?.id;
    checkAddressSql(id, next, (checkResult) => {
      const sqlPassword = checkResult[0]?.password;
      comparePassword(inputPassword, sqlPassword, next, () => {
        // Generate a new hashed password for the new email
        hashPassword(newPassword, next, (hashedPassword) => {
          // finally update the address with the new email and hashed password
          const values = [newEmail, hashedPassword, id];
          updateAddress(values);
        });
      });
    });
  });
};

//  DELETE
//  DELETE client FROM...
//  fb/delete-all
export const deleteClient = (req, res, next) => {
  if (!req.query.password || !req.query.full_name) {
    console.error("Add your password and full name");
    return constErr(400, "Please insert password and full name", next);
  }
  const inputPassword = req.query.password;
  const fullName = req.query.full_name.trim().split(" ");
  if (fullName.length !== 2) {
    console.error("fullName.length !== 2");
    return constErr(400, "Add your full name like: John Doe", next);
  }
  const clientSql = `SELECT id FROM clients WHERE first_name = ? AND  last_name = ?`;
  const orderSql = `SELECT * FROM orders WHERE client_id = ?;`;
  const deleteOrderSql = `DELETE FROM orders WHERE client_id = ?;`;

  checkClientSql(fullName, next, (idResult) => {
    const id = idResult[0]?.id;
    checkOrderF(id);
  });

  //  check if the client has an order if it has delete all, if not delete address and client
  function checkOrderF(id) {
    db.query(orderSql, [id], (err, orderResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      if (orderResult.length !== 0) {
        //  delete all
        return deleteOrderF(id);
      }
      // delete address and client if they exist
      deleteWhetherOrNot(id, inputPassword, res, next);
    });
  }

  function deleteOrderF(id) {
    db.query(deleteOrderSql, [id], (err, deleteOrderResult) => {
      if (err) {
        console.error("Error fetching client:", err);
        return next(new Error());
      }
      console.log("Order deleted:", deleteOrderResult);
      // Call deleteWhetherOrNot()
      deleteWhetherOrNot(id, inputPassword, res, next);
    });
  }
};
