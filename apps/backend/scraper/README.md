## Installation
1. Clone the repository
2. Copy the `.env.example` file to `.env` and fill in the necessary information
3. Run the scrapping python script

## Scraper
The scrapper is a python script that aggregates data from multiple [data sources](#datasource) and registers the right entries in the Directus collections while adding relations between them. 

## The AI description generator
The AI description generator is a python script that uses an [ollama](https://ollama.com) sdk and a local model to generate a description for each domain in the collection. 
The descriptions are saved in a DE-AI-domains-description.csv file in the data folder.

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

DE-domains-bundeslaender.json query
```sparql
SELECT DISTINCT ?state ?stateLabel ?budget ?website ?population
WHERE {
  ?state wdt:P131/wdt:P279* wd:Q183.
  ?state wdt:P856 ?website.
  ?state wdt:P1082 ?population.
  OPTIONAL { ?state wdt:P2769 ?budget }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?stateLabel)
```

DE-domains-landkreise.json query
```sparql
SELECT DISTINCT ?bundeslandLabel ?state ?stateLabel ?budget ?website ?population
WHERE {
  wd:Q183 wdt:P150 ?bundesland.
  ?bundesland wdt:P150 ?state.
  ?state wdt:P856 ?website.
  ?state wdt:P1082 ?population.
  OPTIONAL { ?state wdt:P2769 ?budget }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY DESC(?bundesland)
```

DE-domains-public-transport.json query
```sparql
SELECT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q178512.
  wd:Q178512 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  MINUS {
    ?result p:P856 ?website.
    ?website (ps:P856) <.pdf>.
  }
  FILTER NOT EXISTS {?result wdt:P1671 ?route}
  FILTER NOT EXISTS {?result wdt:P559 ?terminus}
  FILTER NOT EXISTS {?result wdt:P1545 ?ordinal}
}
ORDER BY ASC(?cityLabel)
```

DE-domains-schools.json query
```sparql
SELECT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q3914.
  wd:Q3914 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-universities.json query
```sparql
SELECT DISTINCT ?result ?resultLabel ?categoryLabel ?cityLabel ?website ?studentsCount
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q875538.
  wd:Q875538 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  ?result wdt:P2196 ?studentsCount
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-hospitals.json query
```sparql
SELECT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q16917.
  wd:Q16917 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-government-agencies.json query
```sparql
SELECT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q327333.
  wd:Q327333 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-museums.json query
```sparql
SELECT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q33506.
  wd:Q33506 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-theaters.json query
```sparql
SELECT DISTINCT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q24354.
  wd:Q24354 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-libraries.json query
```sparql
SELECT DISTINCT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q7075.
  wd:Q7075 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-police.json query
```sparql
SELECT DISTINCT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q732717.
  wd:Q732717 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-fire-departments.json query
```sparql
SELECT DISTINCT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q6498663.
  wd:Q6498663 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-charitable-organization.json query
```sparql
SELECT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q708676.
  wd:Q708676 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

DE-domains-religious-buildings.json query
```sparql
SELECT DISTINCT ?result ?resultLabel ?categoryLabel ?cityLabel ?website
WHERE {
  ?result wdt:P31/wdt:P279* wd:Q24398318.
  wd:Q24398318 wdt:P373 ?category.
  ?result wdt:P17 wd:Q183.
  ?result wdt:P131 ?city.
  ?result wdt:P856 ?website.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY ASC(?cityLabel)
```

EU-domains-countries.json query
```sparql
SELECT DISTINCT ?state ?stateLabel ?budget ?website ?population ?langcode
WHERE {
  wd:Q458 wdt:P150 ?state.
  ?state wdt:P856 ?website.
  ?state wdt:P1082 ?population.
  ?state wdt:P37 ?language.
  ?language wdt:P424 ?langcode
  OPTIONAL { ?state wdt:P2769 ?budget }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
ORDER BY DESC(?population)
```

DE-domains-city.json query
```sparql
SELECT ?bundeslandLabel ?stateLabel ?areaLabel ?city ?cityLabel ?budget ?website ?population ?categoryLabel
WHERE {
  BIND("city" AS ?categoryLabel) .
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
SELECT ?bundeslandLabel ?stateLabel ?areaLabel ?city ?cityLabel ?budget ?website ?population ?categoryLabel
WHERE {
  BIND("city" AS ?categoryLabel) .
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