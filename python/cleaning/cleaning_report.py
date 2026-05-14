
import pandas as pd
import json
import sys

file_path = sys.argv[1]

# Read dataset
if file_path.endswith(".csv"):

    df = pd.read_csv(file_path)

elif file_path.endswith(".xlsx"):

    df = pd.read_excel(file_path)

elif file_path.endswith(".json"):

    df = pd.read_json(file_path)

# Cleaning report
report = {}

# Missing values
missing_values = {

    col: int(val)

    for col, val in
    df.isnull().sum().items()

    if val > 0
}

# Duplicate rows
duplicate_rows = int(
    df.duplicated().sum()
)

# Empty columns
empty_columns = [

    col

    for col in df.columns

    if df[col].isnull().all()
]

# Datatypes
data_types = {

    col: str(dtype)

    for col, dtype in
    df.dtypes.items()
}

# Detect numeric strings
numeric_string_columns = []

for col in df.select_dtypes(
    include=['object']
).columns:

    sample_values = (
        df[col]
        .dropna()
        .astype(str)
        .head(10)
    )

    numeric_like_count = 0

    for value in sample_values:

        cleaned = value.replace(
            ",",
            ""
        ).replace(
            ".",
            ""
        )

        if cleaned.isdigit():

            numeric_like_count += 1

    if numeric_like_count >= 5:

        numeric_string_columns.append(col)

# Final report
report = {

    "missing_values":
        missing_values,

    "duplicate_rows":
        duplicate_rows,

    "empty_columns":
        empty_columns,

    "data_types":
        data_types,

    "numeric_string_columns":
        numeric_string_columns,
}

# Return JSON
print(json.dumps(report))