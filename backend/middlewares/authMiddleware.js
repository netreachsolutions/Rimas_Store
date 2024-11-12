// middlewares/authMiddleware.js
const AuthService = require("../services/authService");

module.exports = (requiredRole) => (req, res, next) => {
  console.log('attemting auth')
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Split by space
  
  
  if (!token) {
    return res.sendStatus(401); // Unauthorized if token is not present
  }
  
  const tokenAssets = AuthService.validateAccessToken(token);
  console.log(token)
  // console.log('requiredRole='+requiredRole+' requestRole='+tokenAssets.role)
  if (!tokenAssets) {
    return res.sendStatus(403); // Forbidden if token is invalid
  }
  
  if (tokenAssets.role != requiredRole) {
    return res.sendStatus(403);
  }

  if (tokenAssets.role == 'customer') {
    req.tokenAssets = tokenAssets; // Attach customer to the request
  } 

  if (tokenAssets.role == 'customer_auth' ) {
    req.tokenAssets = tokenAssets; // Attach type to the request
  }

  if (tokenAssets.role == 'register_auth' ) {
    req.tokenAssets = tokenAssets; // Attach type to the request
  }

  next();
};
