import requests
from bs4 import BeautifulSoup
import ollama
import pandas as pd
import json
from tqdm import tqdm
import time

# Step 1: Analyze the content of a website using local LLM in Olama
def analyze_website_content(url, prompt):
    response = requests.get(url, timeout=30, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    text = soup.get_text()

    # Use Olama to analyze the content

    response = ollama.chat(
        model='mistral', messages=[
        {
            'role': 'user',
            'content': prompt + text[:1000]
        },
    ])

    description = response['message']['content']

    # Clean up the description. Remove any HTML tags and extra spaces
    description = BeautifulSoup(description, "html.parser").get_text()

    # Remove starting and ending " and \n
    description = description.strip().strip('"')

    # Remove starting {"
    if description.startswith('{"'):
        description = description[2:]

    # Remove ending "}
    if description.endswith('"}'):
        description = description[:-2]

    return description

# Step 2: Return a 250-character description from the URL
def get_website_data(url, prompt):
    description = analyze_website_content(url, prompt)
    return description

def get_raw_domains_df():
    with open('../../data/2-DE-domains-bundesland.json') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df = df[df['website'].notna()]
    return df

def get_processed_domains_df():
    # load the csv
    df = pd.read_csv('../../data/DE-AI-domains-description.csv')
    return df

def get_domain_list():
    df = get_raw_domains_df()
    processed = get_processed_domains_df()

    # Remove duplicates from processed
    processed = processed.drop_duplicates(subset=['url'])

    # Remove the processed domains from the list
    df = df[~df['website'].isin(processed['url'])]

    return df['website'].tolist()

# Example usage
urls = get_domain_list()

# For each URL, get the website description and inject into a csv. Show a progress bar.
df = pd.read_csv('website_descriptions.csv')
df = df if df is not None else pd.DataFrame(columns=['url', 'description'])
for url in tqdm(urls, desc="Analyzing websites", unit="url"):
    prompt = f"Analyze the following website content and provide a 250-character description: "
    try:
        description = get_website_data(url, prompt)
        df.loc[len(df)] = [url, description]
    except Exception as e:
        df.loc[len(df)] = [url, '']
    time.sleep(1)
    df.to_csv('../../data/DE-AI-domains-description.csv', index=False)


