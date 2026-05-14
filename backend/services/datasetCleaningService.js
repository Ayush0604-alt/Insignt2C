const { spawn } =
    require("child_process");

const cleanDataset = (

    filePath,

    removeDuplicates,

    dropMissing,

    missingStrategy

) => {

    return new Promise(

        (resolve, reject) => {

        const pythonProcess =
            spawn(

"C:/Users/ayush/OneDrive/Desktop/Diagram/venv/Scripts/python.exe",

                [

"../python/cleaning/clean_dataset.py",

                    filePath,

                    removeDuplicates,

                    dropMissing,

                    missingStrategy,
                ]
            );

        let result = "";

        let errorOutput = "";

        pythonProcess.stdout.on(

            "data",

            (data) => {

                result +=
                    data.toString();
            }
        );

        pythonProcess.stderr.on(

            "data",

            (data) => {

                errorOutput +=
                    data.toString();
            }
        );

        pythonProcess.on(

            "close",

            (code) => {

                if (code === 0) {

                    resolve(
                        result.trim()
                    );

                } else {

                    reject(
                        errorOutput
                    );
                }
            }
        );
    });
};

module.exports =
    cleanDataset;