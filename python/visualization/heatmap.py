import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import sys
import os
import time

# Arguments
file_path = sys.argv[1]

chart_color = "orange"

if len(sys.argv) > 2:

    temp_color = str(
        sys.argv[2]
    ).strip().lower()

    if temp_color != "":

        chart_color = temp_color

# Color maps
cmap_map = {

    "orange":"Oranges",

    "blue":"Blues",

    "green":"Greens",

    "red":"Reds",

    "purple":"Purples",

    "gray":"Greys"
}

if chart_color not in cmap_map:

    chart_color = "orange"

final_cmap = cmap_map[
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

    print("Unsupported file")

    sys.exit()

# Numeric dataframe
numeric_df = df.select_dtypes(
    include=['number']
)

if numeric_df.shape[1] < 2:

    print(
        "Need multiple numeric columns"
    )

    sys.exit()

# Correlation
corr = numeric_df.corr()

# Plot
plt.figure(figsize=(10,8))

sns.heatmap(

    corr,

    annot=True,

    cmap=final_cmap
)

plt.title(
    "Correlation Heatmap"
)

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