const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const config = require("./config");
const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const DeliveryPartner = require("./models/DeliveryPartner");

const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/delivery", deliveryRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/delivery", deliveryRoutes);

const seedData = async () => {
  const adminEmail = config.adminEmail;
  const adminPassword = config.adminPassword;

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });
  }

  const restaurantExists = await Restaurant.exists({ name: "Spice House" });
  if (!restaurantExists) {
    await Restaurant.create({
      name: "Spice House",
      cuisine: "Indian",
      rating: 4.7,
      priceRange: "$",
      deliveryTime: 25,
      vegetarian: true,
      popularity: 95,
      latitude: 12.9716,
      longitude: 77.5946
    });
  }

  const partnerExists = await DeliveryPartner.exists({ phone: "9999999999" });
  if (!partnerExists) {
    await DeliveryPartner.create({
      name: "Ravi",
      phone: "9999999999",
      latitude: 12.972,
      longitude: 77.595,
      available: true,
      currentOrders: 1
    });
  }
};

mongoose.connect(config.mongoURI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedData();
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });