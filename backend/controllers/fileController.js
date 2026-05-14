const getColumns =
    require("../services/columnService");

const uploadFile = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message:
                    "No file uploaded",
            });
        }

        const filePath =
            req.file.path;

        // Extract columns
        const columns =
            await getColumns(filePath);

        res.status(200).json({

            message:
                "File uploaded successfully",

            filePath,

            columns,
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
    uploadFile,
};