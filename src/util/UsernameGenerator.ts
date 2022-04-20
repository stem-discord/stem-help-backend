function UsernameGenerator(username: string, limit = 1) {
  // return a yielding function
  // TODO: actually implement this
  return (function* () {
    yield username;
  })();
}

export default UsernameGenerator;
