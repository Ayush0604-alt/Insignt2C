import pandas as pd
import sys
import os
import time

# Arguments
file_path = sys.argv[1]

remove_duplicates = sys.argv[2]

drop_missing = sys.argv[3]

missing_strategy = sys.argv[4]

# Read dataset
if file_path.endswith(".csv"):

    df = pd.read_csv(file_path)

elif file_path.endswith(".xlsx"):

    df = pd.read_excel(file_path)

elif file_path.endswith(".json"):

    df = pd.read_json(file_path)

else:

    print("Unsupported file format")

    sys.exit()

# Remove duplicates
if remove_duplicates == "true":

    df = df.drop_duplicates()

# Drop missing rows
if drop_missing == "true":

    df = df.dropna()

# Fill missing using mean
if missing_strategy == "mean":

    numeric_cols = df.select_dtypes(

        include=['number']
    ).columns

    for col in numeric_cols:

        df[col] = df[col].fillna(

            df[col].mean()
        )

# Fill missing using median
elif missing_strategy == "median":

    numeric_cols = df.select_dtypes(

        include=['number']
    ).columns

    for col in numeric_cols:

        df[col] = df[col].fillna(

            df[col].median()
        )

# Fill missing using mode
elif missing_strategy == "mode":

    for col in df.columns:

        mode_value = df[col].mode()[0]

        df[col] = df[col].fillna(

            mode_value
        )

# Create filename
timestamp = int(time.time())

filename = f"cleaned_{timestamp}.csv"

# Current directory
current_dir = os.path.dirname(

    os.path.abspath(__file__)
)

# Cleaned data folder
cleaned_data_dir = os.path.abspath(

    os.path.join(

        current_dir,

        "../../backend/cleaned_data"
    )
)

# Create folder if not exists
os.makedirs(

    cleaned_data_dir,

    exist_ok=True
)

# Final save path
save_path = os.path.join(

    cleaned_data_dir,

    filename
)

# Save cleaned dataset
df.to_csv(

    save_path,

    index=False
)

# Return path
print(save_path.strip())