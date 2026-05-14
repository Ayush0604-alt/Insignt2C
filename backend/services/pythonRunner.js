const { spawn } = require("child_process");

const runPythonScript = (
    filePath,
    chartType,
    xColumn,
    yColumn
) => {

    return new Promise((resolve, reject) => {

        let scriptPath = "";

        // Select script dynamically
        if (chartType === "histogram") {

            scriptPath =
                "../python/visualization/histogram.py";

        }

        else if (chartType === "bar") {

            scriptPath =
                "../python/visualization/bar_chart.py";
        }

        else if (chartType === "pie") {

            scriptPath =
                "../python/visualization/pie_chart.py";
        }

        else if (chartType === "scatter") {

            scriptPath =
                "../python/visualization/scatter_plot.py";
        }
         else if (chartType === "heatmap") {

            scriptPath =
                "../python/visualization/heatmap.py";
        }

        else {

            return reject(
                "Invalid chart type"
            );
        }

        // Run Python
        const pythonProcess = spawn(

            "C:/Users/ayush/OneDrive/Desktop/Diagram/venv/Scripts/python.exe",

            [
                scriptPath,
                filePath,
                 xColumn || "",
                 yColumn || "",
            ]
        );

        let result = "";

        let errorOutput = "";

        // Python stdout
        pythonProcess.stdout.on(
            "data",
            (data) => {

                result += data.toString();
            }
        );

        // Python stderr
        pythonProcess.stderr.on(
            "data",
            (data) => {

                errorOutput += data.toString();
            }
        );

        // Process close
        pythonProcess.on(
            "close",
            (code) => {

                const output =
                    result.trim();

                // Detect Python logical errors
                if (

                    output.includes("No numeric") ||

                    output.includes("Need at least") ||

                    output.includes("No categorical") ||

                    output.includes("Unsupported") ||

                    output.includes("Error")

                ) {

                    reject(output);
                }

                // Detect Python runtime errors
                else if (code !== 0) {

                    reject(errorOutput);
                }

                // Success
                else {

                    resolve(output);
                }
            }
        );
    });
};

module.exports = runPythonScript;