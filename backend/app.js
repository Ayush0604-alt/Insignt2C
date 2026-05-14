const express = require("express");

const cors = require("cors");

const path = require("path");

// Routes
const fileRoutes =
    require("./routes/fileRoutes");

const chartRoutes =
    require("./routes/chartRoutes");

const columnRoutes =
    require("./routes/columnRoutes");

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true,
}));

// Frontend
app.use(

    express.static(

        path.join(
            __dirname,
            "../frontend"
        )
    )
);

// Generated Charts
app.use(

    "/generated_charts",

    express.static(

        path.join(
            __dirname,
            "generated_charts"
        )
    )
);

// Cleaned Datasets
app.use(

    "/cleaned_data",

    express.static(

        path.join(
            __dirname,
            "cleaned_data"
        )
    )
);

// Uploaded Files
app.use(

    "/uploads",

    express.static(

        path.join(
            __dirname,
            "uploads"
        )
    )
);

// Routes
app.use(
    "/api/upload-file",
    fileRoutes
);

app.use(
    "/api/generate-chart",
    chartRoutes
);

app.use(
    "/api/columns",
    columnRoutes
);

// Home Route
app.get("/", (req, res) => {

    res.send(
        "InsightForge API Running"
    );
});

module.exports = app;