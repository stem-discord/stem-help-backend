import * as lib from "../../lib/index.js";

const { ApiError, catchAsync, pick } = lib.util;
const config = lib.config;

const router = lib.Router();

router.get(
  `/`,
  catchAsync(async (req, res) => {
    const ip = req.headers[`x-forwarded-for`] || req.socket.remoteAddress;
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <meta content="${ip}" property="og:title" />
  <meta content="Site Description" property="og:description" />
</head>
<body>
  
</body>
</html>
    `);
  })
);

export default router;
