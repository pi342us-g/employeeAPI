// import jwt
const jwt = require("jsonwebtoken");
// import the secret key of your API
const JWT_SECRET = process.env.JWT_SECRET;

// Below middleware function is going to protect different routes of our application
function auth(req, res, next) {
  // get the authorisation header from the incoming request
  const authHeader = req.headers.authorization;
  //   console.log("The content of the header", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
//   console.log("token", token);

  // check whether the sent request contains the authorization tokens
  if(!token) res.status(401).json({message:"No Authorization token provided"});

  // check whether the token provided is valid or not
  try {
      // verify the token using the secret key
    //   if the token is valid decode it and store user info in req.user
    const decoded =jwt.verify(token,JWT_SECRET);
    // console.log("decoded", decoded);
    req.user = decoded;
    // if the token has been verifiedd and it is correct move on to the next step
    next();

  } catch (error) {
      res.status(403).json({message:"Invalid Token"});
  }
}

// export the module
module.exports = auth;
