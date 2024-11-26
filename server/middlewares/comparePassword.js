import bcrypt from "bcrypt";

function comparePassword(inputPassword, sqlPassword, next, ifResult) {
  bcrypt.compare(inputPassword, sqlPassword, (err, result) => {
    if (err) {
      console.error("Error comparing password:", err);
      return next(new Error());
    }
    if (!result) {
      console.error("Password Doesn't match");
      const err = new Error("Incorrect password");
      err.status = 401;
      return next(err);
    }
    console.log("Authenticated!");
    ifResult(result);
  });
}

export default comparePassword;
