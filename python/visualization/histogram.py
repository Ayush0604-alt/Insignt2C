import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
import time

# Arguments
file_path = sys.argv[1]

x_column = str(
    sys.argv[2]
).strip()

# Default customization
chart_color = "orange"

bins = 20

# Read optional color
if len(sys.argv) > 3:

    temp_color = str(
        sys.argv[3]
    ).strip().lower()

    if temp_color != "":

        chart_color = temp_color

# Read optional bins
if len(sys.argv) > 4:

    try:

        bins = int(
            sys.argv[4]
        )

    except:

        bins = 20

# Supported colors
color_map = {

    "orange": "#ea580c",

    "blue": "#2563eb",

    "green": "#16a34a",

    "red": "#dc2626",

    "purple": "#9333ea",

    "black": "#111827",

    "pink": "#db2777",

    "yellow": "#ca8a04",

    "brown": "#92400e",

    "gray": "#4b5563"
}

# Fallback color
if chart_color not in color_map:

    chart_color = "orange"

final_color = color_map[
    chart_color
]

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

# Clean malformed column names
x_column = x_column.replace(
    "[",
    ""
).replace(
    "]",
    ""
).replace(
    "'",
    ""
).replace(
    '"',
    ""
).strip()

# Validation
if x_column not in df.columns:

    print("Invalid column")

    sys.exit()

# Handle duplicate columns safely
x_data = df.loc[:, x_column]

if isinstance(x_data, pd.DataFrame):

    x_data = x_data.iloc[:, 0]

# Convert numeric
x_data = pd.to_numeric(

    x_data,

    errors="coerce"
)

# Remove invalid rows
x_data = x_data.dropna()

# Empty validation
if x_data.empty:

    print("No valid numeric data")

    sys.exit()

# Plot
plt.figure(figsize=(10,6))

sns.histplot(

    x_data,

    kde=True,

    bins=bins,

    color=final_color
)

plt.title(
    f"Distribution of {x_column}"
)

plt.xlabel(x_column)

plt.ylabel("Frequency")

# Filename
timestamp = int(time.time())

filename = f"chart_{timestamp}.png"

# Save path
current_dir = os.path.dirname(__file__)

save_path = os.path.abspath(

    os.path.join(

        current_dir,

        "../../backend/generated_charts",

        filename
    )
)

# Save chart
plt.tight_layout()

plt.savefig(save_path)

plt.close()

# Return filename
print(filename)