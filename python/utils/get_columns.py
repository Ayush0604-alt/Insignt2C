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

# Numeric columns
numeric_columns = list(

    df.select_dtypes(
        include=['number']
    ).columns
)

# Categorical columns
categorical_columns = list(

    df.select_dtypes(
        include=['object']
    ).columns
)

# Final result
result = {

    "all_columns":
        list(df.columns),

    "numeric_columns":
        numeric_columns,

    "categorical_columns":
        categorical_columns,
}

print(json.dumps(result))