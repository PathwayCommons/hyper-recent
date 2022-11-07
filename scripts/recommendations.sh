#!/bin/bash

PAPER_IDS=("PMID:33933186" "PMID:33318676" "PMID:32165850")
CATEGORY_IDS=("alzheimers-diagnosis" "alzheimers-neuroinflammation" "alzheimers-therapeutics")

DATA_DIRECTORY="../example-data"
MAX_PAPERS=50

API_BASE_URL=https://api.semanticscholar.org/
API_VERSION_PATH=v1/

ACADEMIC_GRAPH_API_PATH=graph/
ACADEMIC_GRAPH_PAPER_PATH=paper/
ACADEMIC_GRAPH_PAPER_FIELDS=title,tldr,publicationDate,venue,journal,externalIds,authors

PAPER_RECOMMENDATIONS_API_PATH=recommendations/
PAPER_RECOMMENDATIONS_PATH=papers/forpaper/
PAPER_RECOMMENDATIONS_LIMIT=500
PAPER_RECOMMENDATIONS_FIELDS=title,year,externalIds,venue,authors,abstract

for i in ${!CATEGORY_IDS[@]}; do
  CATEGORY_ID=${CATEGORY_IDS[$i]}
  PAPER_ID=${PAPER_IDS[$i]}
  RECOMMENDATION_URL="${API_BASE_URL}${PAPER_RECOMMENDATIONS_API_PATH}${API_VERSION_PATH}${PAPER_RECOMMENDATIONS_PATH}${PAPER_ID}?limit=${PAPER_RECOMMENDATIONS_LIMIT}&fields=${PAPER_RECOMMENDATIONS_FIELDS}"

  echo "Fetching from Semantic Scholar ${RECOMMENDATIONS_API_PATH}"
  echo "Paper: ${PAPER_ID}"
  echo "CATEGORY_ID: ${CATEGORY_ID}"

  json=$(curl -s -X GET ${RECOMMENDATION_URL})
  recommendedPapers=$(echo ${json} | jq '.recommendedPapers')

  numPapersRaw=$(echo ${recommendedPapers} | jq 'length')
  echo "numPapers (Total): ${numPapersRaw}"

  selectedPapers=$(
    echo ${recommendedPapers} | jq '[ .[] |
    select((.venue == "bioRxiv" or (.venue == "medRxiv")) and (.year == 2022)) |
    .paperId
    ] |
    .[0:'${MAX_PAPERS}']'
  )

  numPapers=$(echo ${selectedPapers} | jq 'length')
  echo "numPapers (Filtered): ${numPapers}"

  # echo ${selectedPapers} | jq > ${DATA_DIRECTORY}/${CATEGORY_ID}.json

  ### Get the paper details
  # RECOMMENDATION_URL="${API_BASE_URL}${ACADEMIC_GRAPH_API_PATH}${API_VERSION_PATH}${ACADEMIC_GRAPH_PAPER_PATH}.?fields=${ACADEMIC_GRAPH_PAPER_FIELDS}"
  DELAY=1
  selectedPapersArr=( $(echo ${selectedPapers} | jq '.[]') )
  COUNTER=0
  NUM_ITEMS=${#selectedPapersArr[@]}
  echo "numitems ${NUM_ITEMS}"
  echo '[' > ${DATA_DIRECTORY}/${CATEGORY_ID}.json
  for i in "${selectedPapersArr[@]}"
  do
    let COUNTER++
    id=$(echo ${i} | tr -d '"')
    ACADEMIC_GRAPH_PAPER_URL="${API_BASE_URL}${ACADEMIC_GRAPH_API_PATH}${API_VERSION_PATH}${ACADEMIC_GRAPH_PAPER_PATH}${id}?fields=${ACADEMIC_GRAPH_PAPER_FIELDS}"
    json=$(curl -s -X GET ${ACADEMIC_GRAPH_PAPER_URL})
    record=$(
      echo ${json} | jq '. |
      {
        paperId: .paperId,
        title: .title,
        journal: .venue,
        date: .publicationDate,
        doi: .externalIds.DOI,
        brief: .tldr.text,
        authors: .authors | [.[] | .name] | join("; ")
      }'
    )
    printf "%s" "${record}" >> ${DATA_DIRECTORY}/${CATEGORY_ID}.json
    if [ "${COUNTER}" == "${NUM_ITEMS}" ]; then
      printf "%s\n" "" >> ${DATA_DIRECTORY}/${CATEGORY_ID}.json
    else
      printf "%s\n" "," >> ${DATA_DIRECTORY}/${CATEGORY_ID}.json
    fi

    sleep ${DELAY}
  done
  echo ']' >> ${DATA_DIRECTORY}/${CATEGORY_ID}.json
done

