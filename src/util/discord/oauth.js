function buildUri(id, redirect, scopes) {
  return `https://discord.com/api/oauth2/authorize?client_id=${id}&redirect_uri=${encodeURIComponent(
    redirect
  )}&response_type=code&scope=${encodeURIComponent(scopes.join(` `))}`;
}
export { buildUri };
