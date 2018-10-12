module.exports = {
  isLogined: function(req, res) {
    return req.user ? true : false;
  },
  uiStatus: function(req, res) {
    return this.isLogined(req, res)
      ? `${req.user.nickname} | <a href="/auth/logout">logout</a>`
      : `<a href="/auth/login">login</a>`;
  }
};
