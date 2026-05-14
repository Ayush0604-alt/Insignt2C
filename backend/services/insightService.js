const { spawn } =
    require("child_process");

const generateInsights =
    (filePath) => {

    return new Promise(

        (resolve, reject) => {

        const pythonProcess =
            spawn(

                "python",

                [

                    "../python/analysis/insight_generator.py",

                    filePath
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

                        JSON.parse(
                            result
                        )
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
    generateInsights;