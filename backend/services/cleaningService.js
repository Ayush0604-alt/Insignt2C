const { spawn } = require("child_process");

const generateCleaningReport = (
    filePath
) => {

    return new Promise((resolve, reject) => {

        const pythonProcess = spawn(

            "C:/Users/ayush/OneDrive/Desktop/Diagram/venv/Scripts/python.exe",

            [
                "../python/cleaning/cleaning_report.py",
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

                    try {

                        resolve(
                            JSON.parse(
                                result.trim()
                            )
                        );

                    } catch (error) {

                        reject(error);
                    }

                } else {

                    reject(errorOutput);
                }
            }
        );
    });
};

module.exports =
    generateCleaningReport;