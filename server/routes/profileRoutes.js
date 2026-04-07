const express = require("express");
const router = express.Router();
const { getProfile, compareUsers } = require("../controllers/profileController");

router.get("/:username", getProfile);
router.get("/compare", compareUsers);

module.exports = router;