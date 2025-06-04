import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  // Create json web token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Put said token in cookies
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true, // Prevents XSS attacks cross-site scripting attacks - JS on browser can't access token
    sameSite: "strict", // Limits cookies sending on cross-site requests to prevent CSRF (Cross-Site Request Forgery)
    secure: process.env.NODE_ENV !== "development", // Can only be sent over HTTPS when true
  });

  return token;
};
