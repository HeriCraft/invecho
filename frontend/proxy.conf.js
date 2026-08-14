module.exports = {
  "/api": {
    target: process.env.BACKEND_URL || "http://invecho-backend:3000",
    secure: false,
    changeOrigin: true
  }
};
