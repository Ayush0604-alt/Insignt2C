const runPythonScript =
    require("../services/pythonRunner");

const generateSummary =
    require("../services/summaryService");

const generateCleaningReport =
    require("../services/cleaningService");
 const cleanDataset =
    require(
        "../services/datasetCleaningService"
    );
const generateInsights =
    require(
        "../services/insightService"
    );
const path = require("path");

const generateChart =
    async (req, res) => {

    try {

        const {

            filePath,

            chartType,

            xColumn,

            yColumn,

           removeDuplicates,

           dropMissing,

           missingStrategy,

        } = req.body;
        let finalFilePath =
    filePath;

// Cleaning options
finalFilePath =

    await cleanDataset(

        filePath,

        removeDuplicates,

        dropMissing,

        missingStrategy
    );

        // Generate chart
        const filename =
            await runPythonScript(

                finalFilePath,

                chartType,

                xColumn,

                yColumn
            );

        // Summary
        const summary =
            await generateSummary(
                finalFilePath,
            );

        // Cleaning report
        const cleaningReport =
            await generateCleaningReport(
                filePath
            );

            const insights =
    await generateInsights(
        finalFilePath
    );


          

   const cleanedFilename =
    path.basename(
        finalFilePath
    );
res.status(200).json({

    message:
        "Chart generated successfully",

    summary,

    cleaningReport,

    insights,

    cleanedFileUrl:

`http://${window.location.origin}/cleaned_data/${cleanedFilename}`,

    imageUrl:

`${req.protocol}://${req.get("host")}/generated_charts/${filename}`,
});

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                error.toString(),
        });
    }
};

module.exports = {
    generateChart,
};