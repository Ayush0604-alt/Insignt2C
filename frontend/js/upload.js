let uploadedFilePath = "";

let datasetColumns = {};



// Elements
const uploadBtn =
    document.getElementById(
        "uploadDatasetBtn"
    );

const generateBtn =
    document.getElementById(
        "generateChartBtn"
    );

const addChartBtn =
    document.getElementById(
        "addChartBtn"
    );

// Event Listeners
uploadBtn.addEventListener(
    "click",
    uploadDataset
);

generateBtn.addEventListener(
    "click",
    generateChart
);

addChartBtn.addEventListener(
    "click",
    addDashboardChart
);

document
    .getElementById(
        "chartType"
    )
    .addEventListener(
        "change",
        updateColumnDropdowns
    );

// Upload Dataset
async function uploadDataset() {

    const fileInput =
        document.getElementById(
            "fileInput"
        );

    const uploadStatus =
        document.getElementById(
            "uploadStatus"
        );

    if (!fileInput.files[0]) {

        uploadStatus.innerText =
            "Please select a dataset";

        return;
    }

    const formData =
        new FormData();

    formData.append(
        "file",
        fileInput.files[0]
    );

    try {

        uploadStatus.innerText =
            "Uploading dataset...";

        const response =
            await fetch(

`${window.location.origin}/api/upload-file`,

                {
                    method:"POST",
                    body:formData,
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message
            );
        }

        uploadedFilePath =
            data.filePath;

        datasetColumns =
            data.columns;

        updateColumnDropdowns();

        uploadStatus.innerText =
            "Dataset uploaded successfully";

    } catch(error){

        console.log(error);

        uploadStatus.innerText =
            error.message;
    }
}

// Update Dropdowns
function updateColumnDropdowns() {

    const chartType =
        document.getElementById(
            "chartType"
        ).value;

    const xColumn =
        document.getElementById(
            "xColumn"
        );

    const yColumn =
        document.getElementById(
            "yColumn"
        );

    const xContainer =
        document.getElementById(
            "xColumnContainer"
        );

    const yContainer =
        document.getElementById(
            "yColumnContainer"
        );

    const heatmapInfo =
        document.getElementById(
            "heatmapInfo"
        );

        const binsContainer =

    document.getElementById(
        "binsContainer"
    );

    xColumn.innerHTML = "";

    yColumn.innerHTML = "";

    heatmapInfo.classList.add(
        "hidden"
    );

    // Histogram
    if(chartType === "histogram"){


        binsContainer.style.display =
    "block";
        yContainer.style.display =
            "none";

        xContainer.style.display =
            "block";

        datasetColumns.numeric_columns
            ?.forEach((col)=>{

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = col;

                option.textContent = col;

                xColumn.appendChild(
                    option
                );
            });
    }

    // Pie
    else if(chartType === "pie"){

        yContainer.style.display =
            "none";

        xContainer.style.display =
            "block";
binsContainer.style.display =
    "none";
        datasetColumns.categorical_columns
            ?.forEach((col)=>{

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = col;

                option.textContent = col;

                xColumn.appendChild(
                    option
                );
            });
    }

    // Scatter
    else if(chartType === "scatter"){

        yContainer.style.display =
            "block";

        xContainer.style.display =
            "block";
            binsContainer.style.display =
    "none";

        datasetColumns.numeric_columns
            ?.forEach((col)=>{

                const option1 =
                    document.createElement(
                        "option"
                    );

                option1.value = col;

                option1.textContent = col;

                xColumn.appendChild(
                    option1
                );

                const option2 =
                    document.createElement(
                        "option"
                    );

                option2.value = col;

                option2.textContent = col;

                yColumn.appendChild(
                    option2
                );
            });
    }

    // Bar
   // Bar
else if(chartType === "bar"){

    yContainer.style.display =
        "block";

    xContainer.style.display =
        "block";
binsContainer.style.display =
    "none";
    datasetColumns
        .categorical_columns
        .filter(

            (col)=>

                !col
                .toLowerCase()
                .includes("id")
        )

        .forEach((col)=>{

            const option =
                document.createElement(
                    "option"
                );

            option.value = col;

            option.textContent = col;

            xColumn.appendChild(
                option
            );
        });

    datasetColumns.numeric_columns
        ?.forEach((col)=>{

            const option =
                document.createElement(
                    "option"
                );

            option.value = col;

            option.textContent = col;

            yColumn.appendChild(
                option
            );
        });
}

    // Heatmap
    else if(chartType === "heatmap"){

        xContainer.style.display =
            "none";

        yContainer.style.display =
            "none";

            binsContainer.style.display =
    "none";

        heatmapInfo.classList.remove(
            "hidden"
        );
    }
}

// Validation
function validateChartSelection(

    chartType,

    xColumn,

    yColumn
){

    if(
        chartType === "pie"
    ){

        if(
            xColumn
            .toLowerCase()
            .includes("id")
        ){

            return
"Pie chart not suitable for ID columns";
        }
    }

    if(
        chartType === "scatter"
    ){

        if(xColumn === yColumn){

            return
"Scatter plot requires different columns";
        }
    }

    if(
        chartType === "heatmap"
    ){

        if(
datasetColumns.numeric_columns
.length < 2
        ){

            return
"Heatmap requires multiple numeric columns";
        }
    }

    return null;
}

// Generate Main Chart
async function generateChart(){

    const chartType =
        document.getElementById(
            "chartType"
        ).value;

    const xColumn =
        document.getElementById(
            "xColumn"
        ).value;

    const yColumn =
        document.getElementById(
            "yColumn"
        ).value;

    const removeDuplicates =
        document.getElementById(
            "removeDuplicates"
        ).checked;

    const dropMissing =
        document.getElementById(
            "dropMissing"
        ).checked;

    const missingStrategy =
        document.getElementById(
            "missingStrategy"
        ).value;

    const chartImage =
        document.getElementById(
            "chartImage"
        );

    const summaryBox =
        document.getElementById(
            "summaryBox"
        );

    const message =
        document.getElementById(
            "message"
        );
  const chartColor =

    document.getElementById(
        "chartColor"
    ).value;

const bins =

    document.getElementById(
        "binsInput"
    ).value;
    const validationError =

        validateChartSelection(

            chartType,

            xColumn,

            yColumn
        );

    if(validationError){

        message.innerText =
            validationError;

        return;
    }

    try{
         if(!uploadedFilePath){

    message.innerText =
        "Please upload dataset first";

    return;
}
        message.innerText =
            "Generating chart...";

            

        const response =
            await fetch(

`${window.location.origin}/api/generate-chart`,

                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json",
                    },

                    body:JSON.stringify({

                        filePath:
                            uploadedFilePath,

                        chartType,

                        xColumn,

                        yColumn,

                        removeDuplicates,

                        dropMissing,

                        missingStrategy,

                        chartColor,

                          bins,
                    }),
                }
            );

        const data =
            await response.json();

        if(!response.ok){

            throw new Error(
                data.message
            );
        }

        // Show Chart
        chartImage.src =

`${data.imageUrl}?t=${new Date().getTime()}`;

        chartImage.classList.remove(
            "hidden"
        );
        
       const emptyState =

    document.getElementById(
        "emptyChartState"
    );

if(emptyState){

    emptyState.remove();
}

        document
            .getElementById(
                "downloadSection"
            )
            .classList.remove(
                "hidden"
            );

        // Download links
        document
            .getElementById(
                "downloadChartBtn"
            ).href =
                data.imageUrl;

        document
            .getElementById(
                "downloadDatasetBtn"
            ).href =
                data.cleanedFileUrl;

        // Show summary
        summaryBox.classList.remove(
            "hidden"
        );

        const summary =
            data.summary;

        const cleaningReport =
            data.cleaningReport;

        const insights =
            data.insights;

        summaryBox.innerHTML = `

<div class="summary-grid">

    <div class="stat-card">

        <h3>Total Rows</h3>

        <p>${summary.rows}</p>

    </div>

    <div class="stat-card">

        <h3>Total Columns</h3>

        <p>${summary.columns}</p>

    </div>

    <div class="stat-card">

        <h3>Duplicate Rows</h3>

        <p>${summary.duplicate_rows}</p>

    </div>

</div>

<div class="analytics-layout">

    <div class="analytics-card">

        <h2>
            Cleaning Report
        </h2>

        <div class="report-item">

            <span>
                Duplicate Rows
            </span>

            <strong>

${cleaningReport.duplicate_rows}

            </strong>

        </div>

        <div class="report-item">

            <span>
                Empty Columns
            </span>

            <strong>

${cleaningReport.empty_columns.length}

            </strong>

        </div>

    </div>

    <div class="analytics-card insights-card">

        <h2>
            AI Insights
        </h2>

        <ul>

${(insights || []).map(

(item)=>`

<li>${item}</li>

`).join("")}

        </ul>

    </div>

</div>
`;

        message.innerText =
            "Chart generated successfully";

            document
    .getElementById(
        "downloadDatasetBtn"
    ).href =

        data.cleanedFileUrl;

    }catch(error){

        console.log(error);

        message.innerText =
            error.message;
    }
}

// Add Dashboard Chart
function addDashboardChart(){

    document
        .getElementById(
            "dashboardSection"
        )
        .classList.remove(
            "hidden"
        );

    alert(
"Will Add Multiple Charts in future"
    );
}