// import express from "express";
// import path from "path";
// import { renderFile } from "ejs";

// import config from "../config";

// const { config, logger } = config;
// const { info } = logger;
// const app = express();
// const base = {
//   apiURL: config.apiURL ?? `http://localhost:${config.staticApp}/v1/`,
// };
// app.set(`views`, path.join(__dirname, `views`));
// app.set(`view engine`, `ejs`);
// // app.engine(`html`, require(`ejs`).renderFile);
// app.engine(`.ejs`, { renderFile }.renderFile);
// app
//   .get(`/test`, (req, res) => {
//     info(`test page has been viewed`);
//     res.render(`test`, { ...base });
//   });
// // TODO: fix this sloppy hack
// app.get(`*`, (req, res) => {
//   info(`Serving default directory`);
//   res.render(path.join(__dirname, `views`, req.path, `index.ejs`), { ...base }, (err, html) => {
//     if (err) {
//       info(err);
//       res.status(404).render(`404`);
//     }
//     else {
//       res.send(html);
//     }
//   });
// });
export default {};
