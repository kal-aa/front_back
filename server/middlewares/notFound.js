const notFound = (req, res, next) => {
  console.error("NOT FOUND");
  res.render("notfound", { message: req.originalUrl });
};
export default notFound;
