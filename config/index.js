module.exports = {
  port: Number(process.env.PORT) || 5000,
  mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin@12345"
};
