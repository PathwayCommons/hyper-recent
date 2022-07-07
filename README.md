# hyper-recent

Hyper-recent article feed

## CLI

To see the CLI help, do `node hyper-recent.js help`.

Examples:

- Download the data for Janurary 2022: `node hyper-recent.js download 2022-01-01 2022-01-31 > example-data/2022-01.json`
- What articles in June match 'breast cancer'? `cat example-data/2022-06.json | node hyper-recent.js search "breast cancer"`
    - Colour the JSON output: `cat example-data/2022-06.json | node hyper-recent.js search "breast cancer" | jq`
    - Scroll through the JSON output: `cat example-data/2022-06.json | node hyper-recent.js search "breast cancer" | less`
    - Count the articles: `cat example-data/2022-06.json | node hyper-recent.js search "breast cancer" | jq "length"`
    - Get a short list of just the article titles: `cat example-data/2022-06.json | node hyper-recent.js search "breast cancer" | jq "map(.title)"`

