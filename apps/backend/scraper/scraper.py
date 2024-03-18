import numpy as np
from directus_api import DirectusApi
import pandas as pd
import json
import time
import os, dotenv, re
from modules.versionmanager_api import VersionmanagerApi
from cleantext import clean


# Load environment variables
dotenv.load_dotenv()

# Settings
country_id = 1 # Germany

# Connect to directus API to post the data to a collection
api = DirectusApi(username=os.getenv('DIRECTUS_EMAIL'), password=os.getenv('DIRECTUS_PASSWORD'),
                      endpoint=os.getenv('DIRECTUS_URL'))

def get_domain_cities_df():
    with open('../data/2-DE-domains-bundesland.json') as f:
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
    with open('../data/2-DE-domains-bundesland.json') as f:
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
    with open('../data/2-DE-domains-bundesland.json') as f:
        data = json.load(f)
    df = pd.DataFrame(data)
    df = df[df['website'].notna()]

    return df

def get_sites_df():
    with open('../data/2-DE-domains-bundesland.json') as f:
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
    df = pd.DataFrame(systems)

    # Create a new column with the original_url from the systems['system'] list.
    df['original_url'] = df['system'].apply(lambda x: x['original_url'])
    df['id'] = df['system'].apply(lambda x: x['id'])

    # Fix columns with numbers as Int64
    # df['systemtype'] = df['systemtype'].astype('Int64')
    # df['detected_system_type'] = df['detected_system_type'].astype('Int64')
    # df['detection_accuracy'] = df['detection_accuracy'].astype('Int64')
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
    city_to_population = dict(zip(domain_data['cityLabel'], domain_data['population']))

    # Populate cities['state_id'] using the mapping dictionary
    cities['state_id'] = cities['Name'].map(city_to_state).astype('Int64')
    cities['population'] = cities['Name'].map(city_to_population).astype('Int64')
    cities['country_id'] = country_id

    # Keep only the columns that are needed
    cities = cities[['id', 'state_id', 'country_id', 'status', 'Name', 'sort', 'population']]
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

def register_new_domains_in_directus():
    print('Registering new domains in Directus.')
    domains = pd.DataFrame(api.get_items(collection="domain"))
    domain_data = get_raw_domains_df()

    # Filter out the domains in domain_data that are already in the domains Directus collection.
    domain_data = domain_data[~domain_data['website'].isin(domains['url'])]

    if domain_data.empty:
        print('No new domains to register.')
        return

    # Get data from Directus
    cities = pd.DataFrame(api.get_items(collection="City"))
    states = pd.DataFrame(api.get_items(collection="state"))

    # Get system data from versionmanager
    systems = get_systems_df()

    # Create a city_id column from the id
    cities['city_id'] = cities['id']

    # Create a state_id column from the id
    states['state_id'] = states['id']

    # Populate the domain_data with the state_id matching the state name in states with the bundeslandLabel in domain_data
    domain_data = domain_data.merge(states, left_on='bundeslandLabel', right_on='name', how='left')

    # Populate the domain_data with the city_id matching the city name in cities with the cityLabel in domain_data
    domain_data = domain_data.merge(cities[['Name', 'city_id']], left_on='cityLabel', right_on='Name', how='left')

    # Populate the raw_versionmanager with the systems row as json matching that has the 'original_url' the same as the 'website' in domain_data
    #itterate over the rows in domain_data
    for index, row in domain_data.iterrows():
        # get the system that has the same 'original_url' as the 'website' in domain_data
        system_df = systems[systems['original_url'] == row['website']]
        system = systems[systems['original_url'] == row['website']].to_json(orient='records')
        # if the system is not empty
        if system:
            # add the system to the domain_data
            domain_data.at[index, 'raw_versionmanager'] = system
            domain_data.at[index, 'versionmanager_id'] = system_df['id'].values[0] if not system_df.empty else None

    # Convert the versionmanager_id to Int64
    domain_data['versionmanager_id'] = domain_data['versionmanager_id'].astype('Int64')

    # Clean up the domain_data
    domain_data['url'] = domain_data['website']
    domain_data['status'] = 'published'
    domain_data = domain_data[['url', 'city_id', 'state_id', 'status', 'raw_versionmanager']]

    status = api.create_items(collection="domain", items=domain_data.to_dict('records'))
    print(status.status_code)
    return

def update_domains_in_directus():
    print('Updating domains in Directus.')
    domains = pd.DataFrame(api.get_items(collection="domain"))
    domain_data = get_raw_domains_df()

    if domains.empty:
        print('No new domains to update.')
        return

    # Get data from Directus
    cities = pd.DataFrame(api.get_items(collection="City"))
    states = pd.DataFrame(api.get_items(collection="state"))
    description = pd.read_csv('../data/DE-AI-domains-description.csv')

    # Rename the description url column to description_url
    description.rename(columns={'url': 'description_url'}, inplace=True)

    # Fix the description column using the cleanup_string_text_characters() function
    description = description.drop_duplicates(subset=['description_url'])
    description['description'] = description['description'].apply(clean, lower=False)

    # Get system data from versionmanager
    systems = get_systems_df()

    # create a column from the id
    cities['city_id'] = cities['id']
    states['state_id'] = states['id']
    domains['domain_id'] = domains['id']


    # Populate the domain_data with the state_id matching the state name in states with the bundeslandLabel in domain_data
    domain_data = domain_data.merge(states, left_on='bundeslandLabel', right_on='name', how='left')

    # Populate the domain_data with the city_id matching the city name in cities with the cityLabel in domain_data
    domain_data = domain_data.merge(cities[['Name', 'city_id']], left_on='cityLabel', right_on='Name', how='left')

    domain_data = domain_data.merge(domains[['url', 'domain_id']], left_on='website', right_on='url', how='left')
    domain_data = domain_data.merge(description[['description_url', 'description']], left_on='website', right_on='description_url', how='left')

    # Populate the raw_versionmanager with the systems row as json matching that has the 'original_url' the same as the 'website' in domain_data
    #itterate over the rows in domain_data
    for index, row in domain_data.iterrows():
        # get the system that has the same 'original_url' as the 'website' in domain_data
        system_df = systems[systems['original_url'] == row['website']]
        system = systems[systems['original_url'] == row['website']].to_json(orient='records')
        # if the system is not empty
        if system:
            # add the system to the domain_data
            domain_data.at[index, 'raw_versionmanager'] = system
            domain_data.at[index, 'versionmanager_id'] = system_df['id'].values[0] if not system_df.empty else None

    # Convert the versionmanager_id to Int64
    domain_data['versionmanager_id'] = domain_data['versionmanager_id'].astype('Int64')

    # Clean up the domain_data
    domain_data['url'] = domain_data['website']
    domain_data['status'] = 'published'
    domain_data = domain_data[['url', 'city_id', 'state_id', 'status', 'raw_versionmanager', 'domain_id', 'description']]
    domain_data = domain_data.rename(columns={'domain_id': 'id'})

    # Break into 10 item chunks
    domain_data_chunks = np.array_split(domain_data, len(domain_data) / 10)

    for chunk in domain_data_chunks:
        try :
            status = api.update_items(collection="domain", items=chunk.to_dict('records'))
            print(status.status_code)
        except:
            print('Error updating domains in Directus.' + str(chunk))

    return

### Helpers
def delete_all_items(collection):
    api = DirectusApi(username=os.getenv('DIRECTUS_EMAIL'), password=os.getenv('DIRECTUS_PASSWORD'),
                      endpoint=os.getenv('DIRECTUS_URL'))
    api.delete_all_items_from_collection(collection=collection)
    return

def cleanup_string_text_characters(text):
    # Remove multiple spaces
    text = re.sub(' +', ' ', text)
    # Remove characters that might cause a json error
    text = text.replace('\"', '\'').replace('“', '\'').replace('”', '\'').replace('’', '\'').replace('‘', '\'')
    return text


if __name__ == '__main__':
    # Measuring time
    start = time.time()
    # 1. Get new records from Wikidata (not implemented yet) and store as json files. (can be improved)

    # 2. Register new sites in the versionmanager.
    # register_all_sites_in_versionmanager()

    # 3. Publish new data in Directus.
    # register_new_cities_in_directus()
    # register_new_states_in_directus()
    # register_new_domains_in_directus()

    # 4. Update existing data in Directus.
    # update_all_cities_in_directus()
    update_domains_in_directus()

    #get_systems_df()
    #process_data()
    #delete_all_items('City')

    end = time.time()
    print(f"Time elapsed: {end - start} seconds")

