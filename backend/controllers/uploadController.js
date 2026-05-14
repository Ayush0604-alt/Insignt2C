const generateSummary =
    require("../services/summaryService");

const generateRecommendations =
    require(
        "../services/recommendationService"
    );

const uploadFile = async (req, res) => {

    try {

        console.log("Upload started");

        // Validate file
        if (!req.file) {

            return res.status(400).json({

                message:
                    "No file uploaded",
            });
        }

        console.log("File uploaded");

        // File path
        const filePath =
            req.file.path;

        console.log(filePath);

        // Generate dataset summary
        const summary =
            await generateSummary(
                filePath
            );

        console.log(
            "Summary generated"
        );

        // Generate AI recommendations
        const recommendations =
            await generateRecommendations(
                filePath
            );

        console.log(
            "Recommendations generated"
        );

        // Numeric columns
        const numeric_columns =

            Object.keys(
                summary.data_types
            ).filter(

                (col) =>

                    summary.data_types[col]
                    === "int64"

                    ||

                    summary.data_types[col]
                    === "float64"
            );

        // Categorical columns
        const categorical_columns =

            Object.keys(
                summary.data_types
            ).filter(

                (col) =>

                    summary.data_types[col]
                    === "object"
            );

        // Response
        res.status(200).json({

            message:
                "File uploaded successfully",

            filePath,

            columns: {

                numeric_columns,

                categorical_columns,
            },

            recommendations,
        });

    } catch (error) {

        console.log("ERROR:");

        console.log(error);

        res.status(500).json({

            message:
                "Upload failed",

            error:
                error.toString(),
        });
    }
};

module.exports = {
    uploadFile,
};