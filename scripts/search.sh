#!/bin/bash

CATEGORY_ID="alzheimers-disease"
DATA_DIRECTORY="../example-data"

MEDRXIV_SOURCE="medrxiv"
BIORXIV_SOURCE="biorxiv"

START_DATE=$(node date.js start)
END_DATE=$(node date.js end)

echo "Fetching from ${BIORXIV_SOURCE} between ${START_DATE} and ${END_DATE}"
node ../src/cli.js download --output="${DATA_DIRECTORY}/${END_DATE}_${BIORXIV_SOURCE}.json" --source=${BIORXIV_SOURCE} ${START_DATE} ${END_DATE}

echo "Fetching from ${MEDRXIV_SOURCE} between ${START_DATE} and ${END_DATE}"
node ../src/cli.js download --output="${DATA_DIRECTORY}/${END_DATE}_${MEDRXIV_SOURCE}.json" --source=${MEDRXIV_SOURCE} ${START_DATE} ${END_DATE}

echo "Combining results..."
DATA_FILE="${DATA_DIRECTORY}/${END_DATE}.json"
jq --slurp '[.[][]]' ${DATA_DIRECTORY}/${END_DATE}_*.json > ${DATA_FILE}

QUERY="alzheimer"
OUTPUT_FILE="${DATA_DIRECTORY}/${CATEGORY_ID}.json"
echo "Searching for ${CATEGORY_ID}"
searchHits=$(node ../src/cli.js search --strict --input=${DATA_FILE} ${QUERY})
numSearchHits=$(echo ${searchHits} | jq 'length')
echo "Found ${numSearchHits} hits"

collection=$(
    echo ${searchHits} | jq '[.[] |
    {
      paperId: .doi,
      doi: .doi,
      title: .title,
      journal: .server,
      date: .date,
      brief: null,
      authors: .authors
    }]'
  )

echo ${collection} | jq '.' > ${OUTPUT_FILE}
