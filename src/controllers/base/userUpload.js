function userUpload(user) {
  return {
    author: user._id,
    upload_date: Date.now(),
  };
}

module.exports = userUpload;
