const { spawn } = require("child_process");
const path = require("path");

const CHART_SCRIPTS = {
    histogram: "../python/visualization/histogram.py",
    bar:       "../python/visualization/bar_chart.py",
    pie:       "../python/visualization/pie_chart.py",
    scatter:   "../python/visualization/scatter_plot.py",
    heatmap:   "../python/visualization/heatmap.py",
};

const ERROR_PATTERNS = [
    "No numeric",
    "Need at least",
    "No categorical",
    "Unsupported",
    "Error:",
    "Invalid",
    "No valid",
];

/**
 * Run a Python visualization script.
 * @param {string} filePath  - Absolute path to cleaned dataset
 * @param {string} chartType - One of: histogram | bar | pie | scatter | heatmap
 * @param {string} xColumn   - X-axis column name
 * @param {string} yColumn   - Y-axis column name (optional)
 * @param {string} chartColor - Color name (orange | blue | green | red)
 * @param {number|string} bins - Number of bins for histogram
 * @returns {Promise<string>} - Resolves with the output filename
 */
const runPythonScript = (
    filePath,
    chartType,
    xColumn,
    yColumn,
    chartColor = "orange",
    bins = 20
) => {
    return new Promise((resolve, reject) => {
        const scriptPath = CHART_SCRIPTS[chartType];

        if (!scriptPath) {
            return reject(new Error(`Invalid chart type: ${chartType}`));
        }

        // Build args based on chart type
        let args;

        switch (chartType) {
            case "histogram":
                // histogram.py filePath xColumn color bins
                args = [
                    scriptPath,
                    filePath,
                    xColumn || "",
                    chartColor || "orange",
                    String(bins || 20),
                ];
                break;

            case "bar":
                // bar_chart.py filePath xColumn yColumn color
                args = [
                    scriptPath,
                    filePath,
                    xColumn || "",
                    yColumn || "",
                    chartColor || "orange",
                ];
                break;

            case "scatter":
                // scatter_plot.py filePath xColumn yColumn color
                args = [
                    scriptPath,
                    filePath,
                    xColumn || "",
                    yColumn || "",
                    chartColor || "orange",
                ];
                break;

            case "heatmap":
                // heatmap.py filePath color
                args = [
                    scriptPath,
                    filePath,
                    chartColor || "orange",
                ];
                break;

            case "pie":
                // pie_chart.py filePath xColumn
                args = [
                    scriptPath,
                    filePath,
                    xColumn || "",
                ];
                break;

            default:
                args = [scriptPath, filePath, xColumn || "", yColumn || ""];
        }

        const pythonProcess = spawn("python", args);

        let result = "";
        let errorOutput = "";

        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on("close", (code) => {
            const output = result.trim();

            const isLogicalError = ERROR_PATTERNS.some((pattern) =>
                output.includes(pattern)
            );

            if (isLogicalError) {
                return reject(new Error(output));
            }

            if (code !== 0) {
                return reject(new Error(errorOutput || `Python exited with code ${code}`));
            }

            if (!output) {
                return reject(new Error("Python script produced no output"));
            }

            resolve(output);
        });

        pythonProcess.on("error", (err) => {
            reject(new Error(`Failed to start Python: ${err.message}`));
        });
    });
};

module.exports = runPythonScript;