from directus_api import DirectusApi
import pandas as pd
import json
import os, dotenv
from modules.versionmanager_api import VersionmanagerApi

# Load environment variables
dotenv.load_dotenv()

# Connect to directus API to post the data to a collection
api = DirectusApi(username=os.getenv('DIRECTUS_EMAIL'), password=os.getenv('DIRECTUS_PASSWORD'),
                      endpoint=os.getenv('DIRECTUS_URL'))
country_id = 1 # Germany

def process_data():
    # Load the existing collections into DataFrames

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
    # status = api.create_items(collection="City", items=domain_cities.to_dict('records'))

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
    df['country_id'] = country_id
    filtered_df = df[['cityLabel', 'status']]
    filtered_df = filtered_df.rename(columns={'cityLabel': 'Name'})

    # Filter all as unique values by Name
    filtered_df = filtered_df.drop_duplicates(subset='Name')

    # Sort the values by Name
    filtered_df = filtered_df.sort_values(by='Name')

    return filtered_df

def get_states_df():
    with open('data/2-DE-domains-bundesland.json') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df = df[df['website'].notna()]

    # Filter ouf the missing city names from the dataframe.
    # Theare are some city names that start with Q######## (ex http://www.wikidata.org/entity/Q25581618), this filters them out.
    df = df[~df['cityLabel'].str.contains(r'^Q\d+$')]

    df['status'] = 'published'
    df['country_id'] = country_id

    filtered_df = df[['bundeslandLabel', 'status', 'country_id']]
    filtered_df = filtered_df.rename(columns={'bundeslandLabel': 'name'})

    # Filter all as unique values by Name
    filtered_df = filtered_df.drop_duplicates(subset='name')

    # Sort the values by Name
    filtered_df = filtered_df.sort_values(by='name')

    return filtered_df

def get_raw_domains_df():
    with open('data/2-DE-domains-bundesland.json') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df = df[df['website'].notna()]

    return df

def get_sites_df():
    with open('data/2-DE-domains-bundesland.json') as f:
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

def get_systems_from_versionmanager():
    # Get all systems from the versionmanager
    versionmanager_api = VersionmanagerApi(username=os.getenv('VERSIONMANAGER_EMAIL'), password=os.getenv('VERSIONMANAGER_PASSWORD'),
                      endpoint=os.getenv('VERSIONMANAGER_URL'))
    systems = versionmanager_api.get_systems()
    return systems['data']

def get_systems_df():
    systems = get_systems_from_versionmanager()
    systems_dict = [item['system'] for item in systems]
    df = pd.DataFrame(systems_dict)
    return df

def create_systems_in_versionmanager( domains: list ):
    """
    This will register domains in VersionManager as systems
    after it checks for existing records to prevent duplicates.
    """
    versionmanager_api = VersionmanagerApi(username=os.getenv('VERSIONMANAGER_EMAIL'), password=os.getenv('VERSIONMANAGER_PASSWORD'),
                      endpoint=os.getenv('VERSIONMANAGER_URL'))
    existing_systems = get_systems_df()

    # Filter out the domains that are already in the versionmanager as 'original_url'
    domains = [domain for domain in domains if domain not in existing_systems['original_url'].tolist()]

    if not domains:
        print('No new domains to register.')
        return []

    systems = versionmanager_api.create_systems(domains)
    return systems

### Helpers
def delete_all_items(collection):
    api = DirectusApi(username=os.getenv('DIRECTUS_EMAIL'), password=os.getenv('DIRECTUS_PASSWORD'),
                      endpoint=os.getenv('DIRECTUS_URL'))
    api.delete_all_items_from_collection(collection=collection)
    return

def register_all_sites_in_versionmanager():
    sample_domains = get_sites_df()
    sample_domains = sample_domains['Name'].tolist()
    create_systems_in_versionmanager(sample_domains)

def register_new_cities_in_directus():
    print('Registering new cities in Directus.')
    cities = pd.DataFrame(api.get_items(collection="City"))
    domain_cities = get_domain_cities_df()

    # Filter out the cities in domain_cities that are already in the cities Directus collection.
    domain_cities = domain_cities[~domain_cities['Name'].isin(cities['Name'])]

    if domain_cities.empty:
        print('No new cities to register.')
        return

    status = api.create_items(collection="City", items=domain_cities.to_dict('records'))
    return

def update_all_cities_in_directus():
    print('Updating cities in Directus.')
    cities = pd.DataFrame(api.get_items(collection="City"))
    states = pd.DataFrame(api.get_items(collection="state"))
    domain_data = get_raw_domains_df()

    # Set a state_id column from the id
    states['state_id'] = states['id']

    # Update the domain_data with the state_id matching the state name in states with the bundeslandLabel in domain_data
    domain_data = domain_data.merge(states, left_on='bundeslandLabel', right_on='name', how='left')

    # Create a dictionary mapping cityLabel to state_id from domain_data
    city_to_state = dict(zip(domain_data['cityLabel'], domain_data['state_id']))

    # Populate cities['state_id'] using the mapping dictionary
    cities['state_id'] = cities['Name'].map(city_to_state).astype('Int64')
    cities['country_id'] = country_id

    # Keep only the columns that are needed
    cities = cities[['id', 'state_id', 'country_id', 'status', 'Name']]
    # Update the cities in Directus
    data = cities.to_dict('records')

    # get 10 items from the collection
    status = api.update_items(collection="City", items=cities.to_dict('records'))
    print(status.status_code)
    return

def register_new_cities_in_directus():
    print('Registering new cities in Directus.')
    cities = pd.DataFrame(api.get_items(collection="City"))
    domain_cities = get_domain_cities_df()

    # Filter out the cities in domain_cities that are already in the cities Directus collection.
    domain_cities = domain_cities[~domain_cities['Name'].isin(cities['Name'])]

    if domain_cities.empty:
        print('No new cities to register.')
        return

    status = api.create_items(collection="City", items=domain_cities.to_dict('records'))
    return

def register_new_states_in_directus():
    print('Registering new states in Directus.')
    states = pd.DataFrame(api.get_items(collection="state"))
    domain_states = get_states_df()

    # Filter out the states in domain_states that are already in the states Directus collection.
    domain_states = domain_states[~domain_states['name'].isin(states['name'])]

    if domain_states.empty:
        print('No new states to register.')
        return

    status = api.create_items(collection="state", items=domain_states.to_dict('records'))
    return

if __name__ == '__main__':
    # 1. Get new records from Wikidata (not implemented yet) and store as json files. (can be improved)
    # 2. Register new sites in the versionmanager.
    #register_all_sites_in_versionmanager()
    # 3. Publish new data in Directus.
    #register_new_cities_in_directus()
    #register_new_states_in_directus()

    # 4. Update existing data in Directus.
    update_all_cities_in_directus()






    #get_systems_df()
    #process_data()
    #delete_all_items('City')

