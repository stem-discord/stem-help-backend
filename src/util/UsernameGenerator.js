
function UsernameGenerator(username, limit) {
  // return a yielding function
  // TODO: actually implement this
  return function* () {
    yield username;
  };
}

export default UsernameGenerator;
