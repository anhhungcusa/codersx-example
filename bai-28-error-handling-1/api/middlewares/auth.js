const { Exception } = require("../../utils");
const { verifyToken } = require("../../utils/jwt");
const { statusCodes } = require("../../utils/constant");
module.exports.isAuthorized = async (req, res, next) => {
  let token = req.get("authorization");
  try {
    if (!token) throw new Exception("Token is not valid");
    if (token.indexOf("Bearer ") !== 0)
      throw new Exception("Token is not Bearer Token");
    token = token.slice(7, token.length).trimLeft();
    const { _id, role } = await verifyToken(token, process.env.JWT_SECRET_KEY);
    req.user = {
      _id,
      role
    };
    next();
  } catch ({ message = "Token is not valid" }) {
    res.status(statusCodes.UNAUTHORIZED).send({ message });
  }
};
