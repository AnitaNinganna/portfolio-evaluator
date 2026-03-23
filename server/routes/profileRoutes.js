const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileController");

router.get("/:username", getProfile);

module.exports = router;