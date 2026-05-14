const express = require("express");

const router = express.Router();

const getColumns =
    require("../services/columnService");

router.post("/", async (req, res) => {

    try {

        const filePath =
            req.body.filePath;

        const columns =
            await getColumns(filePath);

        res.json(columns);

    } catch (error) {

        res.status(500).json({
            message:
                error.toString(),
        });
    }
});

module.exports = router;