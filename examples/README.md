# How to run the transformation script
- Transform tabular data to RDF

## Prerequisites
- Install Node.js
- Clone this folder and run
```bash
npm install
```

## Transformation
- Prepare a CSV file (irao-data.csv) with the structure [here](https://github.com/nvbach91/informatics-research-artifacts-ontology/blob/master/examples/irao-data.csv)
- Run
```bash
node parse.js
```
- this will output several RDF serialized files, (ttl, rdf+xml, nt, nq)
- the process of binding can be seen inside the [parse.js](https://github.com/nvbach91/informatics-research-artifacts-ontology/blob/master/examples/parse.js) file
