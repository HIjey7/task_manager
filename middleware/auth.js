import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json("No token");
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret123");

    req.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
};

export default auth;
