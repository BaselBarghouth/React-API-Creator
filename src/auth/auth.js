import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.status(401).json({ message: "sorry you are not allowed" });
  try {
    const verified = jwt.verify(token, "basel");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({
      message: "invalid"
    });
  }
};

export default auth;
