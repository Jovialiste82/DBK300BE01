// backend/utils/generateToken.js
import jwt from "jsonwebtoken";

////////// DEVELOPMENT //////////
// const generateToken = (res, userId) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "30d",
//   });

//   res.cookie("jwt", token, {
//     httpOnly: true,
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
//     // DEVELOPMENT
//     sameSite: "Lax", // Allow cookie to be sent in cross-origin requests
//     secure: false, // Because local development is usually not over HTTPS
//     domain: "192.168.0.213", // Set the domain to your network IP
//   });
// };

// export default generateToken;

////////// PRODUCTION //////////
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  console.log(
    "setting cookie /sameSite=None, secure=true, domain=.dobkonektor.com"
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // PRODUCTION
    sameSite: "None", // Necessary for cross-origin use with secure cookies
    secure: true, // Only send cookie over HTTPS
    domain: ".dobkonektor.com", // Notice the dot before the domain
  });
};

export default generateToken;
