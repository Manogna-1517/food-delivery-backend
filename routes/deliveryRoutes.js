const express = require("express");
const router = express.Router();

const { setStatus, getDeliveryPartners } = require("../controllers/deliveryController");

router.post("/set-status", setStatus);
router.get("/", getDeliveryPartners);

module.exports = router;