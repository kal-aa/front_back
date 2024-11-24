import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import route from "./route.js";
import error from "./middlewares/error.js";
import notFound from "./middlewares/notFound.js";
const port = process.env.PORT || 5000;

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

app.set("view engine", "ejs");

//  change ejs's views folder location to the serve 
app.set("views", path.join(__dirname, 'views'));

// parse incoming body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/FB", route);

// errorhandler
app.use(error);
app.use("*", notFound);

app.listen(port, () => {
  console.log("You're listening to port", port);
});
