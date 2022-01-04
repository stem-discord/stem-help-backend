import nock from "nock";

const scope = nock(`https://discord.com/api/v9`, { allowUnmocked: true })
  .persist(true)
  .get(`/`)
  .reply(404, {
    message: `404: Not Found`,
    code: 0,
    custom: `ʕ•́ᴥ•̀ʔっ`,
  })
  .post(`/oauth2/token`)
  .reply((uri, body) => {
    // Body is a url stream
    // later decode it and then validate
    // if it is invalid, reject

    // this can be used in furhter tests
    console.log(body);
    console.log(body.code);
    return [123, `whatever`];
  });

export default scope;
