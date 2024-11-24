import bcrypt from "bcrypt";

function comparePassword(inputPassword, sqlPassword, ifResult, next) {
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

    return ifResult();
  });
}

export default comparePassword;
