import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import sys
import os
import time

# Arguments
file_path = sys.argv[1]

x_column = str(
    sys.argv[2]
).strip()

y_column = str(
    sys.argv[3]
).strip()

chart_color = "orange"

if len(sys.argv) > 4:

    temp_color = str(
        sys.argv[4]
    ).strip().lower()

    if temp_color != "":

        chart_color = temp_color

# Colors
color_map = {

    "orange":"#ea580c",

    "blue":"#2563eb",

    "green":"#16a34a",

    "red":"#dc2626",

    "purple":"#9333ea",

    "black":"#111827",

    "pink":"#db2777",

    "yellow":"#ca8a04",

    "brown":"#92400e",

    "gray":"#4b5563"
}

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

# Validation
if x_column not in df.columns:

    print("Invalid X column")

    sys.exit()

if y_column not in df.columns:

    print("Invalid Y column")

    sys.exit()

# Handle duplicates safely
x_data = df.loc[:, x_column]

y_data = df.loc[:, y_column]

if isinstance(x_data, pd.DataFrame):

    x_data = x_data.iloc[:, 0]

if isinstance(y_data, pd.DataFrame):

    y_data = y_data.iloc[:, 0]

# Numeric conversion
x_data = pd.to_numeric(

    x_data,

    errors="coerce"
)

y_data = pd.to_numeric(

    y_data,

    errors="coerce"
)

# Create dataframe
plot_df = pd.DataFrame({

    x_column:x_data,

    y_column:y_data
})

plot_df = plot_df.dropna()

if plot_df.empty:

    print("No valid numeric data")

    sys.exit()

# Plot
plt.figure(figsize=(10,6))

sns.scatterplot(

    data=plot_df,

    x=x_column,

    y=y_column,

    color=final_color
)

plt.title(
    f"{y_column} vs {x_column}"
)

plt.xlabel(x_column)

plt.ylabel(y_column)

# Save
timestamp = int(time.time())

filename = f"chart_{timestamp}.png"

save_path = os.path.abspath(

    os.path.join(

        os.path.dirname(__file__),

        "../../backend/generated_charts",

        filename
    )
)

plt.tight_layout()

plt.savefig(save_path)

plt.close()

print(filename)