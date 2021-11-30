import nock from "nock";

const interceptor = nock(`https://discord.com/api/v9`, { allowUnmocked: true }).persist(true).get(`/`);

const scope = interceptor.reply(404, {
  message: `404: Not Found`, code: 0, custom: `ʕ•́ᴥ•̀ʔっ`,
});

export default scope;
