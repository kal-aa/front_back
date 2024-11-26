import createConnection from "../reUses/createConnection.js";
import constErr from "./constErr.js";

const db = createConnection();
const checkSql = `SELECT * FROM clients WHERE first_name = ? AND last_name = ?`;

function checkClientSql(fullName, next, ifCheckClientTrue) {
  db.query(checkSql, fullName, (err, result) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    const id = result[0]?.id;
    if (result.length === 0 || !id) {
      console.error("No client found");
      return constErr(
        404,
        `No data found with the name you've given ${fullName[0]} ${fullName[1]}`,
        next
      );
    }

    ifCheckClientTrue(result);
  });
}

export default checkClientSql;