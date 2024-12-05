import express from "express";
import {
  insertClient,
  insertOrder,
  selectClient,
  selectOrder,
  selectAll,
  updateClient,
  updateAddress,
  deleteClient,
  deleteOrder,
} from "./controllers/rest.js";
const route = express.Router();

//  fb/insert-client
route.post("/insert-client", insertClient);

//  fb/insert-order
route.post("/insert-order", insertOrder);

//  fb/select-client
route.get("/select-client", selectClient);

//  fb/select-order
route.get("/select-order", selectOrder);

//  fb/select-all
route.get("/select-all", selectAll);

//  fb/update-client
route.put("/update-client", updateClient);

//  fb/update-address
route.put("/update-address", updateAddress);

//  fb/delete-all
route.delete("/delete-all", deleteClient);

//  fb/delete-order
route.delete("/delete-order", deleteOrder);

export default route;
