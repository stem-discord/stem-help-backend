
function buildUrl(
  client_id,
  redirect,
  scopes,
) {
  return `https://discord.com/api/oauth2/authorize?client_id=${
    client_id
  }&redirect_uri=${
    encodeURIComponent(redirect)
  }&response_type=code&scope=${
    encodeURIComponent(scopes.join(` `))
  }`;
}

module.exports = {
  buildUrl,
};
