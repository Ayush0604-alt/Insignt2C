const express = require("express");

const router = express.Router();

const {
    generateChart,
} = require(
    "../controllers/chartController"
);

router.post(
    "/",
    generateChart
);

module.exports = router;