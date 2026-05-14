const multer = require("multer");

const path = require("path");

const fs = require("fs");

// Upload folder
const uploadPath = path.join(

    __dirname,

    "../uploads"
);

// Create uploads folder if missing
if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {
        recursive:true
    });
}

// Storage
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(
            null,
            uploadPath
        );
    },

    filename:(req,file,cb)=>{

        cb(

            null,

            Date.now() +

            path.extname(
                file.originalname
            )
        );
    }
});

// File validation
const fileFilter = (

    req,

    file,

    cb
) => {

    const allowedTypes = [

        ".csv",

        ".xlsx",

        ".json"
    ];

    const ext = path.extname(

        file.originalname
    ).toLowerCase();

    if(

        allowedTypes.includes(ext)
    ){

        cb(null,true);

    }else{

        cb(

            new Error(

"Only CSV, XLSX and JSON files allowed"
            ),

            false
        );
    }
};

const upload = multer({

    storage,

    fileFilter
});

module.exports = upload;