const ejs = require(`ejs`);

const ServePage = (page, obj) => {
  if (typeof obj === `string`) {
    obj = {
      message: obj,
    };
  }
  return (req, res) => {
    res.render(
      ejs.render(
        page,
        obj,
      ),
    );
  };
};
