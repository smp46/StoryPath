// cors.js
module.exports = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};

