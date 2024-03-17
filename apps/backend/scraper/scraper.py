from directus_api import DirectusApi
import pandas as pd
import json
import os, dotenv

# Load environment variables
dotenv.load_dotenv()

def process_data():
    # Connect to fastus API to post the data to a collection
    api = DirectusApi(username=os.getenv('FASTUS_EMAIL'), password=os.getenv('FASTUS_PASSWORD'),
                      endpoint="https://ftm.cms.garden")

    # Load the existing collections into DataFrames
    # cities = pd.DataFrame(api.get_items(collection="City"))
    # agencies = pd.DataFrame(api.get_items(collection="agency"))
    # categories = pd.DataFrame(api.get_items(collection="category"))
    # countries = pd.DataFrame(api.get_items(collection="country"))
    # domains = pd.DataFrame(api.get_items(collection="domain"))
    # providers = pd.DataFrame(api.get_items(collection="provider"))
    # states = pd.DataFrame(api.get_items(collection="state"))
    # techstacks = pd.DataFrame(api.get_items(collection="tech_stack"))
    # versionmanager = pd.DataFrame(api.get_items(collection="versionmanager"))
    #... Maybe more

    domain_cities = get_domain_cities_df()

    # Create collection items.
    # status = api.create_items(collection="City", items=domain_cities.to_dict('records'))

    # Update collection items.
    # status = api.update_items(collection="City", items=cities.to_dict('records'))
    return


def get_domain_cities_df():
    with open('german-domains.json') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df = df[df['website'].notna()]

    df['status'] = 'published'
    filtered_df = df[['cityLabel', 'status']]
    filtered_df = filtered_df.rename(columns={'cityLabel': 'Name'})

    # @todo: Fill in the Q25 starting city names with the correct city names.

    return filtered_df

if __name__ == '__main__':
    process_data()
