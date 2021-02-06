# IRAO - Informatics Research Artifacts Ontology
Ontology for informatics research artifacts

### Documentation
- https://w3id.org/def/InformaticsResearchArtifactsOntology
- http://ontology.ethereal.cz/irao-doc/index-en.html
- ORSD https://docs.google.com/document/d/1S3lEMjWqrp2Ypwzi97yViKw0TunlN3pRTAD0er1PvR8

### Usage
```sparql
#get all institutions related to a research artifact through the authors
PREFIX irao: <http://ontology.ethereal.cz/irao/>

SELECT * WHERE {
    ?ira a irao:ResearchArtifact .
    ?ira irao:hasAuthor ?author .
    ?author irao:hasAffiliation ?institution .
    OPTIONAL {
        ?ira irao:hasMaintainer ?maintainer .
        ?maintainer irao:hasAffiliation ?institution .
    }
}

```
