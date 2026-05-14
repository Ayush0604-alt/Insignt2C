import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
import time

matplotlib.rcParams[
    'text.usetex'
] = False

# Arguments
file_path = sys.argv[1]

x_column = str(
    sys.argv[2]
).strip()

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

# Validation
if x_column not in df.columns:

    print("Invalid column")

    sys.exit()

# Top categories
counts = (

    df[x_column]
    .value_counts()
    .head(10)
)

# Safe labels
safe_labels = [

    str(label)
    .replace("$","")
    .replace("\\","")
    .replace("\n"," ")

    for label in counts.index
]

# Multi colors
colors = sns.color_palette(

    "pastel",

    len(counts)
)

# Plot
plt.figure(figsize=(8,8))

plt.pie(

    counts,

    labels=safe_labels,

    autopct="%1.1f%%",

    colors=colors
)

plt.title(
    f"Top Categories of {x_column}"
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