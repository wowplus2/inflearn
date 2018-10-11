module.exports = {
  isLogined: function(req, res) {
    return req.session.is_logined ? true : false;
  },
  uiStatus: function(req, res) {
    return this.isLogined(req, res)
      ? `${req.session.nickname} | <a href="/auth/logout">logout</a>`
      : `<a href="/auth/login">login</a>`;
  }
};
