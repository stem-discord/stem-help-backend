const httpStatus = require(`http-status`);

const { potdService } = require(`../services`);
const catchAsync = require(`../utils/catchAsync`);
const { userUpload } = require(`./base`);

const create = catchAsync(async (req, res) => {
  const {
    question,
    answer,
    explanation,
    metadata,
  } = req.body;

  const newPotd = await potdService.create({
    ...userUpload(req),
    question,
    answer,
    explanation,
    metadata,
  });

  res.status(httpStatus.CREATED).json({
    status: httpStatus.CREATED,
    data: newPotd,
  });
});

module.exports = {
  create,
};
