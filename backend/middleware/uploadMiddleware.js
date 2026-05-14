const multer = require("multer");

const path = require("path");

// Storage
const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(
            null,
            "uploads/"
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

// Upload middleware
const upload = multer({

    storage,

    fileFilter
});

module.exports = upload;