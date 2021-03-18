const fs = require('fs');
const rdf = require('rdflib');
const Namespace = rdf.Namespace;
const literal = rdf.literal;
const store = rdf.graph();
const graph = store.sym('http://ontology.ethereal.cz/irao/sample')
const RDF = Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const RDFS = Namespace('http://www.w3.org/2000/01/rdf-schema#');
const FOAF = Namespace('http://xmlns.com/foaf/0.1/');
const XSD = Namespace('http://www.w3.org/2001/XMLSchema#');
const OWL = Namespace('http://www.w3.org/2002/07/owl#');
const IRAO = Namespace('http://ontology.ethereal.cz/irao/');
const IRAO_INSTANCE = Namespace('http://ontology.ethereal.cz/irao#');
const IRAO_DEV_STATUS = Namespace('http://ontology.ethereal.cz/irao/developmentstatus#');
const IRAO_REPOSITORY_TYPE = Namespace('http://ontology.ethereal.cz/irao/repositorytype#');
const BIBO = Namespace('http://purl.org/ontology/bibo/');
const VIVO = Namespace('http://vivoweb.org/ontology/core#');
const CSO = Namespace('http://cso.kmi.open.ac.uk/schema/cso#');
const CSO_TOPIC = Namespace('https://cso.kmi.open.ac.uk/topics/');

const fileContent = fs.readFileSync('./irao-data.csv', 'utf-8');
fileContent.split(/[\r\n]+/).slice(1).filter((line) => !!line.trim()).forEach((line) => {
    const [
        artifactId, artifactType, artifactName, authorId, authorName, affiliationId, affiliationName,
        developmentStatus, publicationId, publicationType, publicationName, publicationUrl,
        researchAreas, topic, artifactRepositoryId, artifactRepositoryUrl, artifactRepositoryType,
    ] = line.split('\t');
    const artifacts = [
        {
            subject: IRAO_INSTANCE(artifactId),
            properties: [
                {
                    predicate: RDF('type'),
                    objects: [
                        OWL('NamedIndividual'),
                        IRAO(artifactType),
                    ],
                },
                {
                    predicate: RDFS('label'),
                    objects: [
                        literal(artifactName, 'en'),
                    ],
                },
                {
                    predicate: IRAO('hasAuthor'),
                    objects: [
                        IRAO_INSTANCE(authorId),
                    ],
                },
                {
                    predicate: IRAO('hasDevelopmentStatus'),
                    objects: [
                        IRAO_DEV_STATUS(developmentStatus),
                    ],
                },
                {
                    predicate: IRAO('hasPublication'),
                    objects: [
                        IRAO_INSTANCE(publicationId),
                    ],
                },
                {
                    predicate: IRAO('hasResearchArea'),
                    objects: researchAreas.split(',').map((ra) => CSO_TOPIC(ra.trim()))
                },
                {
                    predicate: IRAO('isPublishedAt'),
                    objects: [
                        IRAO_INSTANCE(artifactRepositoryId),
                    ],
                },
            ],
        },
    ];
    const repositories = [
        {
            subject: IRAO_INSTANCE(artifactRepositoryId),
            properties: [
                {
                    predicate: RDF('type'),
                    objects: [
                        OWL('NamedIndividual'),
                        IRAO('Repository'),
                    ],
                },
                {
                    predicate: IRAO('hasURL'),
                    objects: [
                        literal(artifactRepositoryUrl, XSD('anyURI')),
                    ],
                },
                {
                    predicate: IRAO('hasRepositoryType'),
                    objects: [
                        IRAO_REPOSITORY_TYPE(artifactRepositoryType),
                    ],
                },
            ],
        },
    ];
    const publications = [
        {
            subject: IRAO_INSTANCE(publicationId),
            properties: [
                {
                    predicate: RDF('type'),
                    objects: [
                        OWL('NamedIndividual'),
                        IRAO('Publication'),
                        IRAO(publicationType),
                    ],
                },
                {
                    predicate: RDFS('label'),
                    objects: [
                        literal(publicationName, 'en'),
                    ],
                },
                {
                    predicate: IRAO('hasURL'),
                    objects: [
                        literal(publicationUrl, XSD('anyURI')),
                    ],
                },
                {
                    predicate: IRAO('hasTopic'),
                    objects: [
                        literal(topic),
                    ],
                },
            ],
        },
    ];
    const authors = [
        {
            subject: IRAO_INSTANCE(authorId),
            properties: [
                {
                    predicate: RDF('type'),
                    objects: [
                        OWL('NamedIndividual'),
                        IRAO('Researcher'),
                    ],
                },
                {
                    predicate: FOAF('name'),
                    objects: [
                        literal(authorName, 'en'),
                    ],
                },
                {
                    predicate: IRAO('hasAffiliation'),
                    objects: [
                        IRAO_INSTANCE(affiliationId),
                    ],
                },
            ],
        },
    ];
    const affiliations = [
        {
            subject: IRAO_INSTANCE(affiliationId),
            properties: [
                {
                    predicate: RDF('type'),
                    objects: [
                        OWL('NamedIndividual'),
                        IRAO('Affiliation'),
                    ],
                },
                {
                    predicate: FOAF('name'),
                    objects: [
                        literal(affiliationName, 'en'),
                    ],
                },
            ],
        },
    ];

    const parts = [artifacts, repositories, publications, authors, affiliations];
    parts.forEach((part) => {
        part.forEach(({ subject, properties }) => {
            properties.forEach(({ predicate, objects }) => {
                objects.forEach((object) => {
                    store.add(subject, predicate, object, graph);
                });
            });
        });
    });
});

const quads = store.statements;
const lines = quads.map((quad) => {
    const line = [quad.subject, quad.predicate, quad.object, quad.graph].map((term) => {
        if (term.termType === 'NamedNode') {
            return `<${term.value}>`;
        }
        if (term.termType === 'Literal') {
            let res = `"${term.value.replace(/"/g, '&quot;')}"`;
            if (term.language) {
                res += `@${term.language}`;
            } else if (term.datatype) {
                res += `^^<${term.datatype.value}>`;
            }
            return res;
        }
    }).join(' ') + ' . ';
    return line;
}).join('\n');

fs.writeFileSync('sample.nq', lines);

const mediaTypes = {
    'text/turtle': '.ttl',
    'application/rdf+xml': '.rdf',
    'application/n-triples': '.nt',
};
Object.keys(mediaTypes).forEach((mediaType) => {
    const output = rdf.serialize(graph, store, 'http://ontology.ethereal.cz/', mediaType);
    fs.writeFileSync(`sample${mediaTypes[mediaType]}`, output);
});
