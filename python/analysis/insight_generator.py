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

insights = []

# Dataset shape
rows, cols = df.shape

insights.append(
    f"Dataset contains {rows} rows and {cols} columns"
)

# Missing values
missing = df.isnull().sum().sum()

insights.append(
    f"Dataset contains {missing} missing values"
)

# Duplicate rows
duplicates = df.duplicated().sum()

insights.append(
    f"Dataset contains {duplicates} duplicate rows"
)

# Numeric insights
numeric_cols = df.select_dtypes(
    include=['number']
).columns

for col in numeric_cols:

    insights.append(

        f"Average {col} is {round(df[col].mean(),2)}"
    )

    insights.append(

        f"Maximum {col} is {df[col].max()}"
    )

    insights.append(

        f"Minimum {col} is {df[col].min()}"
    )

# Categorical insights
categorical_cols = df.select_dtypes(
    include=['object']
).columns

for col in categorical_cols:

    most_common = df[col].mode()[0]

    insights.append(

        f"Most common {col} is {most_common}"
    )

# Correlation insight
if len(numeric_cols) >= 2:

    corr_matrix = df[numeric_cols].corr()

    highest_corr = 0

    pair = ("", "")

    for i in range(len(numeric_cols)):

        for j in range(i + 1, len(numeric_cols)):

            corr = corr_matrix.iloc[i,j]

            if abs(corr) > abs(highest_corr):

                highest_corr = corr

                pair = (
                    numeric_cols[i],
                    numeric_cols[j]
                )

    insights.append(

        f"Strongest relationship is between {pair[0]} and {pair[1]} with correlation {round(highest_corr,2)}"
    )

# Output JSON
print(json.dumps(insights))