## Installation
1. Clone the repository
2. Copy the `.env.example` file to `.env` and fill in the necessary information
3. Run the scrapping python script

## Datasource
The datasource was gathered from (WikiData)[https://query.wikidata.org/]
The query used to gather the data is:
```sparql
SELECT ?bundeslandLabel ?stateLabel ?areaLabel ?cityLabel ?budget ?website ?population
WHERE {
wd:Q183 wdt:P150 ?bundesland.
?bundesland wdt:P150 ?state.
?state wdt:P150 ?area.
?area wdt:P150 ?city.
?city wdt:P31 wd:Q42744322.
?city wdt:P1082 ?population.
?city wdt:P856 ?website.
OPTIONAL { ?city wdt:P2769 ?budget }
SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-city.json query
```sparql
SELECT ?bundeslandLabel ?stateLabel ?areaLabel ?city ?cityLabel ?budget ?website ?population ?category
WHERE {
  BIND("city" AS ?category) .
  wd:Q183 wdt:P150 ?bundesland.
  ?bundesland wdt:P150 ?state.
  ?state wdt:P150 ?area.
  ?area wdt:P150 ?city.
  ?city wdt:P31 wd:Q42744322.  
  ?city wdt:P1082 ?population.
  ?city wdt:P856 ?website.
  OPTIONAL { ?city wdt:P2769 ?budget }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-town.json query
```sparql
SELECT ?bundeslandLabel ?stateLabel ?areaLabel ?city ?cityLabel ?budget ?website ?population ?category
WHERE {
  BIND("city" AS ?category) .
  wd:Q183 wdt:P150 ?bundesland.
  ?bundesland wdt:P150 ?state.
  ?state wdt:P150 ?area.
  ?area wdt:P150 ?city. 
  ?city wdt:P31 wd:Q116457956.
  ?city wdt:P1082 ?population.
  ?city wdt:P856 ?website.
  OPTIONAL { ?city wdt:P2769 ?budget }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```