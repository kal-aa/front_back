import createConnection from "../reUses/createConnection.js";
import constErr from "./constErr.js";

const db = createConnection();
const addressSql = `SElECT * FROM addresses WHERE client_id = ?`;

function checkAddressSql(id, next, ifCheckAddressTrue) {
  db.query(addressSql, [id], (err, addressResult) => {
    if (err) {
      console.error("Error fetching client:", err);
      return next(new Error());
    }
    if (addressResult.length === 0) {
      console.error(
        "user trying to fetch an order for a client which doesn't have an address"
      );
      return constErr(
        404,
        "Please fill the Address form and then place an order first to see your orders",
        next
      );
    }

    ifCheckAddressTrue(addressResult);
  });
}

export default checkAddressSql;
