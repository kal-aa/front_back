import express from "express";
import route from "./route.js";
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/FB", route);

app.listen(port, () => {
  console.log("You're listening to port", port);
});
