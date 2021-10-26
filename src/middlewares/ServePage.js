const ejs = require(`ejs`);

function ServePage(page, obj) {
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
}

module.exports = ServePage;
