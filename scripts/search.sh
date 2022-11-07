#!/bin/bash

CATEGORY_ID="alzheimers-disease"
DATA_DIRECTORY="../example-data"

MEDRXIV_SOURCE="medrxiv"
BIORXIV_SOURCE="biorxiv"

START_DATE=$(date -v -1m +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

echo "Fetching from ${BIORXIV_SOURCE} between ${START_DATE} and ${END_DATE}"
biorxivPapers=$(node ../src/cli.js download --output="${DATA_DIRECTORY}/${END_DATE}_${BIORXIV_SOURCE}.json" --source=${BIORXIV_SOURCE} ${START_DATE} ${END_DATE})
numPapersRawBiorxiv=$(echo ${biorxivPapers} | jq 'length')
echo "numPapersRawBiorxiv: ${numPapersRawBiorxiv}"

echo "Fetching from ${MEDRXIV_SOURCE} between ${START_DATE} and ${END_DATE}"
medrxivPapers=$(node ../src/cli.js download --output="${DATA_DIRECTORY}/${END_DATE}_${MEDRXIV_SOURCE}.json" --source=${MEDRXIV_SOURCE} ${START_DATE} ${END_DATE})
numPapersRawMedrxiv=$(echo ${medrxivPapers} | jq 'length')
echo "numPapersRawMedrxiv: ${numPapersRawMedrxiv}"

echo "Combining results..."
combined=$(jq --slurp '[.[][]]' ${DATA_DIRECTORY}/${END_DATE}_*.json)
# rm "${DATA_DIRECTORY}/${END_DATE}_${BIORXIV_SOURCE}.json"
# rm "${DATA_DIRECTORY}/${END_DATE}_${MEDRXIV_SOURCE}.json"

DATA_FILE="${DATA_DIRECTORY}/${END_DATE}.json"
echo ${combined} | jq > ${DATA_FILE}


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

echo ${collection} | jq > ${OUTPUT_FILE}
# rm "${DATA_FILE}"
