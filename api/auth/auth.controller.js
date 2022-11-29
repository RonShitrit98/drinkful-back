const authService = require("./auth.service");
const logger = require("../../services/logger.service");

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    req.session.user = user;

    res.json(user);
  } catch (err) {
    logger.error("Failed to Login " + err);
    res.status(401).send({ err: "Failed to Login" });
  }
}

async function signup(req, res) {
  try {
    const account = await authService.signup({ ...req.body });
    logger.debug(
      `auth.route - new account created: ` + JSON.stringify(account.username)
    );
    const user = await authService.login(req.body.email, req.body.password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    logger.error("Failed to signup " + err);
    res.status(500).send({ type: err });
  }
}

async function logout(req, res) {
  try {
    // req.session.destroy()
    req.session.user = null;
    res.send({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).send({ err: "Failed to logout" });
  }
}

async function loadUser(req, res) {
  try {
    res.json(req.session.user);
  } catch {}
}

module.exports = {
  loadUser,
  login,
  signup,
  logout,
};
