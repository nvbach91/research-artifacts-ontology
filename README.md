# IRAO - Informatics Research Artifacts Ontology
Ontology for informatics research artifacts

## Documentation
- https://w3id.org/def/InformaticsResearchArtifactsOntology
- ORSD<sup>1</sup> https://docs.google.com/document/d/1S3lEMjWqrp2Ypwzi97yViKw0TunlN3pRTAD0er1PvR8

## Diagrams
- http://ontology.ethereal.cz/irao-main.svg 
- http://ontology.ethereal.cz/irao-relationship.svg 

## Usage
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
## Competency quesions
- CQ01. What is the artifact's name?
- CQ02. Who is the artifact's creator?
- CQ03. What is the artifact's purpose?
- CQ04. What technology is used to create the artifact?
- CQ05. What maturity stage is the artifact in?
- CQ06. Where is the artifact published?
- CQ07. How is the artifact's licensed?
- CQ08. What is the impact of the artifact?
- CQ09. What field is the artifact targeting?
- CQ10. What type of artifact is it?
- CQ11. Where was this artifact created?
- CQ12. How is the artifact made available?
- CQ13. What is the artifact's design qualities?
- CQ14. How is the artifact made findable?
- CQ15. What other artifacts does this artifact make use of?
- CQ16. What is the relationship between specific artifacts?

## Research output definitions
- [https://www.massey.ac.nz/massey/fms/Research_Management_Services/PBRF/PBRF%20Information%20-%20What%20Are%20Research%20Outputs.pdf](https://www.massey.ac.nz/massey/fms/Research_Management_Services/PBRF/PBRF%20Information%20-%20What%20Are%20Research%20Outputs.pdf)
- [https://www.auckland.ac.nz/en/about/the-university/how-university-works/policy-and-administration/research/output-system-and-reports/research-outputs--definition-and-categories.html]https://www.auckland.ac.nz/en/about/the-university/how-university-works/policy-and-administration/research/output-system-and-reports/research-outputs--definition-and-categories.html)
- [https://www.imperial.ac.uk/materials/postgraduate/phdlist/phd/doing-research/research-outputs-definitions/](https://www.imperial.ac.uk/materials/postgraduate/phdlist/phd/doing-research/research-outputs-definitions/)
- [https://libguides.colorado.edu/products](https://libguides.colorado.edu/products)
- [https://www.ucd.ie/research/t4media/Classification-of-Research-Outputs_0.1.pdf](https://www.ucd.ie/research/t4media/Classification-of-Research-Outputs_0.1.pdf)
- [https://policy.usq.edu.au/documents/152329PL](https://policy.usq.edu.au/documents/152329PL)
- [https://www.csg.org/programs/knowledgeeconomy/1_2_research_output.aspx](https://www.csg.org/programs/knowledgeeconomy/1_2_research_output.aspx)
- [https://www.nottingham.ac.uk/sociology/research/projects/making-science-public/research-output.aspx](https://www.nottingham.ac.uk/sociology/research/projects/making-science-public/research-output.aspx)

## References
1. Suárez-Figueroa, M.C., Gómez-Pérez, A.: **Ontology Requirements Specification**. In: Suárez-Figueroa, M.C., Gómez-Pérez, A., Motta, E., Gangemi, A. (eds.) Ontology Engineering in a Networked World, pp. 93–106. Springer (2012).https://doi.org/10.1007/978-3-642-24794-1_5
