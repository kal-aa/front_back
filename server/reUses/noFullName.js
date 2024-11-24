const noFullName = (fullName, next) => {
  if (fullName.length !== 2) {
    console.error("Please insert your full name");
    const err = new Error("Please add your full name in order to update");
    err.status = 400;
    return next(err);
  }
}

export default noFullName;
