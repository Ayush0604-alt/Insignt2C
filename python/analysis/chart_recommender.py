import pandas as pd
import sys
import json

# File path
file_path = sys.argv[1]

# Read dataset
if file_path.endswith(".csv"):

    df = pd.read_csv(file_path)

elif file_path.endswith(".xlsx"):

    df = pd.read_excel(file_path)

elif file_path.endswith(".json"):

    df = pd.read_json(file_path)

else:

    print("Unsupported format")

    sys.exit()

# Detect columns
numeric_cols = df.select_dtypes(
    include=['number']
).columns

categorical_cols = df.select_dtypes(
    include=['object']
).columns

recommendations = []

# Heatmap recommendation
if len(numeric_cols) >= 3:

    recommendations.append({

        "chart":
            "heatmap",

        "reason":
            "Dataset has multiple numeric columns suitable for correlation analysis"
    })

# Scatter recommendation
if len(numeric_cols) >= 2:

    recommendations.append({

        "chart":
            "scatter",

        "reason":
            "Dataset contains multiple numeric columns suitable for relationship analysis"
    })

# Histogram recommendation
if len(numeric_cols) >= 1:

    recommendations.append({

        "chart":
            "histogram",

        "reason":
            "Numeric distribution can be visualized using histogram"
    })

# Bar recommendation
if (
    len(categorical_cols) >= 1
    and
    len(numeric_cols) >= 1
):

    recommendations.append({

        "chart":
            "bar",

        "reason":
            "Categorical vs numeric comparison available"
    })

# Pie recommendation
if len(categorical_cols) >= 1:

    recommendations.append({

        "chart":
            "pie",

        "reason":
            "Category proportions can be visualized"
    })

print(
    json.dumps(
        recommendations
    )
)