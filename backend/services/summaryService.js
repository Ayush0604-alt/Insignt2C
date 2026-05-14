const { spawn } = require("child_process");

const generateSummary = (
    filePath
) => {

    return new Promise((resolve, reject) => {

        const pythonProcess = spawn(

            "python",

            [
                "../python/analysis/dataset_summary.py",
                filePath,
            ]
        );

        let result = "";

        let errorOutput = "";

        pythonProcess.stdout.on(
            "data",
            (data) => {

                result += data.toString();
            }
        );

        pythonProcess.stderr.on(
            "data",
            (data) => {

                errorOutput += data.toString();
            }
        );

        pythonProcess.on(
            "close",
            (code) => {

                if (code === 0) {

                    resolve(
                        JSON.parse(result.trim())
                    );

                } else {

                    reject(errorOutput);
                }
            }
        );
    });
};

module.exports =
    generateSummary;