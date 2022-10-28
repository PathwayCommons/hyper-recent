#!/bin/bash

RECOMMENDATION_URL="https://api.semanticscholar.org/graph/v1/paper/3c03c8a179c5aa71b4d05c71add4f4d1a779f262/?fields=title,tldr,publicationDate,venue,journal,authors,externalIds"
json=$(curl -s -X GET ${RECOMMENDATION_URL})
selectedPapers=$(
  echo ${json} | jq '. |
  {
    paperId: .paperId,
    authors: .authors | [.[] | .name] | join(", ")
  }'
)

echo ${selectedPapers} | jq