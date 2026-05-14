import pandas as pd
import json
import sys
import numpy as np

file_path = sys.argv[1]

# Read dataset
if file_path.endswith(".csv"):
    df = pd.read_csv(file_path)

elif file_path.endswith(".xlsx"):
    df = pd.read_excel(file_path)

elif file_path.endswith(".json"):
    df = pd.read_json(file_path)

# Dataset dimensions
rows = int(df.shape[0])
columns = int(df.shape[1])

# Missing values
missing_values = {
    col: int(val)
    for col, val in df.isnull().sum().items()
}

# Duplicate rows
duplicate_rows = int(
    df.duplicated().sum()
)

# Datatypes
data_types = {
    col: str(dtype)
    for col, dtype in df.dtypes.items()
}

# Numeric summary
numeric_summary = {}

numeric_columns = df.select_dtypes(
    include=['number']
).columns

for col in numeric_columns:

    numeric_summary[col] = {

        "mean":
            round(float(df[col].mean()), 2),

        "median":
            round(float(df[col].median()), 2),

        "min":
            round(float(df[col].min()), 2),

        "max":
            round(float(df[col].max()), 2),
    }

# Final summary
summary = {

    "rows": rows,

    "columns": columns,

    "missing_values":
        missing_values,

    "duplicate_rows":
        duplicate_rows,

    "data_types":
        data_types,

    "numeric_summary":
        numeric_summary,
}

# Print JSON safely
print(json.dumps(summary))