function buildUri(id, redirect, scopes = `identity`) {
  if (id === undefined) {
    throw new Error(`id is required`);
  }
  if (redirect === undefined) {
    throw new Error(`redirect is required`);
  }
  if (Array.isArray(scopes)) {
    scopes = scopes.join(` `);
  }
  return `https://discord.com/api/oauth2/authorize?client_id=${id}&redirect_uri=${encodeURIComponent(
    redirect
  )}&response_type=code&scope=${encodeURIComponent(scopes)}`;
}
export { buildUri };
