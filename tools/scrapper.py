from directus_api import DirectusApi
import pandas as pd
import json
import os, dotenv

# Load environment variables
dotenv.load_dotenv()

def process_data():
    # Connect to fastus API to post the data to a collection
    api = DirectusApi(username=os.getenv('DIRECTUS_EMAIL'), password=os.getenv('DIRECTUS_PASSWORD'),
                      endpoint=os.getenv('DIRECTUS_URL'))

    # Load the existing collections into DataFrames
    cities = pd.DataFrame(api.get_items(collection="City"))
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
    # sites = get_sites_df(cities)

    # Create City items.
    status = api.create_items(collection="City", items=domain_cities.to_dict('records'))

    # Update collection items.
    # status = api.update_items(collection="City", items=cities.to_dict('records'))
    return

def get_domain_cities_df():
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

    return filtered_df

def get_sites_df( cities_df ):
    with open('data/2-german-sites.json') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df = df[df['website'].notna()]

    # Filter ouf the missing city names from the dataframe.
    # Theare are some city names that start with Q######## (ex http://www.wikidata.org/entity/Q25581618), this filters them out.
    df = df[~df['cityLabel'].str.contains(r'^Q\d+$')]

    df['status'] = 'published'
    filtered_df = df[['cityLabel', 'status', 'website']]
    filtered_df = filtered_df.rename(columns={'website': 'Name', 'cityLabel': 'City'})

    return filtered_df

### Helpers
def delete_all_items(collection):
    api = DirectusApi(username=os.getenv('FASTUS_EMAIL'), password=os.getenv('FASTUS_PASSWORD'),
                      endpoint="https://ftm.cms.garden")
    api.delete_all_items_from_collection(collection=collection)
    return

if __name__ == '__main__':
    process_data()
    #delete_all_items('City')

