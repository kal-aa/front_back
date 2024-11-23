import express from "express";
import {
  insertAddress,
  insertClient,
  insertOrder,
  selectClient,
  selectAddress,
  selectOrder,
  selectAll,
  updateClient,
  updateAddress,
  deleteClient,
} from "./controllers/rest.js";
const route = express.Router();

//  fb/insert-client
route.post("/insert-client", insertClient);

//  fb/insert-address
route.post("/insert-address", insertAddress);

//  fb/insert-order
route.post("/insert-order", insertOrder);

//  fb/select-client
route.get("/select-client", selectClient);

//  fb/select-address
route.get("/select-address", selectAddress);

//  fb/select-order
route.get("/select-order", selectOrder);

//  fb/select-all
route.get("/select-all", selectAll);

//  fb/update-client
route.put("/update-client", updateClient);

//  fb/update-address
route.put("/update-address", updateAddress);

//  fb/delete-client
route.delete("/delete-client", deleteClient);

export default route;
