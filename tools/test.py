import pandas as pd
import json

with open('data/2-DE-domains-bundesland.json') as f:
    data = json.load(f)

df = pd.DataFrame(data)
df = df[df['website'].notna()]

# Filter ouf the missing city names from the dataframe.
# Theare are some city names that start with Q######## (ex http://www.wikidata.org/entity/Q25581618), this filters them out.
df = df[~df['cityLabel'].str.contains(r'^Q\d+$')]

df['status'] = 'published'
filtered_df = df[['cityLabel', 'status']]
filtered_df = filtered_df.rename(columns={'cityLabel': 'Name'})

# Filter all as unique values by Name
filtered_df = filtered_df.drop_duplicates(subset='Name')

# Sort the values by Name
filtered_df = filtered_df.sort_values(by='Name')

print(df)
    