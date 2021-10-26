const ejs = require(`ejs`);

function ServePage(page, obj) {
  if (typeof obj === `string`) {
    obj = {
      message: obj,
    };
  }
  return (req, res) => {
    res.send(
      ejs.render(
        page,
        obj,
      ),
    );
  };
}

module.exports = ServePage;
