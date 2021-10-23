const express = require(`express`);

const catchAsync = require(`../../../utils/catchAsync`);
const { config } = require(`../../../config`);

// const router = express.Router();

const login = catchAsync(async (req, res) => {
  // check if code params exist
  if (req.user) {
    return res.status(200).json({
      status: `success`,
      message: `You are already logged in`,
    });
  }
  return res.status(200).json({
    status: `success`,
    redirect: `${config.discordOAuth}`,
  });
});

module.export = {
  login,
};