const redirect = (err, req, res, next) => {
  if (req.query.redirect) {
    return res.redirect(req.query.redirect);
  }
  next();
};

module.exports = redirect;
