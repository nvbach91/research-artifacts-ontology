const fs = require('fs');
const rdf = require('rdflib');
const Namespace = rdf.Namespace;
const literal = rdf.literal;
const store = rdf.graph();
const graph = store.sym('http://ontology.ethereal.cz/irao/sample');
const namespaces = {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    foaf: 'http://xmlns.com/foaf/0.1/',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    owl: 'http://www.w3.org/2002/07/owl#',
    
    irao: 'http://ontology.ethereal.cz/irao/',
    irao_publication: 'http://ontology.ethereal.cz/irao/publication#',
    irao_repository: 'http://ontology.ethereal.cz/irao/repository#',
    irao_author: 'http://ontology.ethereal.cz/irao/author#',
    irao_artifact: 'http://ontology.ethereal.cz/irao/artifact#',
    irao_affiliation: 'http://ontology.ethereal.cz/irao/affiliation#',

    irao_dev_status: 'http://ontology.ethereal.cz/irao/developmentstatus#',
    irao_repository_type: 'http://ontology.ethereal.cz/irao/repositorytype#',
    
    bibo: 'http://purl.org/ontology/bibo/',
    vivo: 'http://vivoweb.org/ontology/core#',
    cso: 'http://cso.kmi.open.ac.uk/schema/cso#',
    cso_topic: 'https://cso.kmi.open.ac.uk/topics/',
};
Object.keys(namespaces).forEach((prefix) => {
    store.namespaces[prefix] = namespaces[prefix];
});
const ns = {};
Object.keys(namespaces).forEach((prefix) => {
    ns[prefix.toUpperCase()] = Namespace(namespaces[prefix]);
});

const fileContent = fs.readFileSync('./irao-data.csv', 'utf-8');
fileContent.split(/[\r\n]+/).slice(1).filter((line) => !!line.trim()).forEach((line) => {
    const [
        artifactId, artifactType, artifactName, authorId, authorName, affiliationId, affiliationName,
        developmentStatus, publicationId, publicationType, publicationName, publicationUrl,
        researchAreas, topic, artifactRepositoryId, artifactRepositoryUrl, artifactRepositoryType,
    ] = line.split('\t');
    const artifacts = [
        {
            subject: ns.IRAO_ARTIFACT(artifactId),
            properties: [
                {
                    predicate: ns.RDF('type'),
                    objects: [
                        ns.OWL('NamedIndividual'),
                        ns.IRAO(artifactType),
                    ],
                },
                {
                    predicate: ns.RDFS('label'),
                    objects: [
                        literal(artifactName, 'en'),
                    ],
                },
                {
                    predicate: ns.IRAO('hasAuthor'),
                    objects: [
                        ns.IRAO_AUTHOR(authorId),
                    ],
                },
                {
                    predicate: ns.IRAO('hasDevelopmentStatus'),
                    objects: [
                        ns.IRAO_DEV_STATUS(developmentStatus),
                    ],
                },
                {
                    predicate: ns.IRAO('hasPublication'),
                    objects: [
                        ns.IRAO_PUBLICATION(publicationId),
                    ],
                },
                {
                    predicate: ns.IRAO('hasResearchArea'),
                    objects: researchAreas.split(',').map((ra) => ns.CSO_TOPIC(ra.trim()))
                },
                {
                    predicate: ns.IRAO('isPublishedAt'),
                    objects: [
                        ns.IRAO_REPOSITORY(artifactRepositoryId),
                    ],
                },
            ],
        },
    ];
    const repositories = [
        {
            subject: ns.IRAO_REPOSITORY(artifactRepositoryId),
            properties: [
                {
                    predicate: ns.RDF('type'),
                    objects: [
                        ns.OWL('NamedIndividual'),
                        ns.IRAO('Repository'),
                    ],
                },
                {
                    predicate: ns.IRAO('hasURL'),
                    objects: [
                        literal(artifactRepositoryUrl, ns.XSD('anyURI')),
                    ],
                },
                {
                    predicate: ns.IRAO('hasRepositoryType'),
                    objects: [
                        ns.IRAO_REPOSITORY_TYPE(artifactRepositoryType),
                    ],
                },
            ],
        },
    ];
    const publications = [
        {
            subject: ns.IRAO_PUBLICATION(publicationId),
            properties: [
                {
                    predicate: ns.RDF('type'),
                    objects: [
                        ns.OWL('NamedIndividual'),
                        ns.IRAO('Publication'),
                        ns.IRAO(publicationType),
                    ],
                },
                {
                    predicate: ns.RDFS('label'),
                    objects: [
                        literal(publicationName, 'en'),
                    ],
                },
                {
                    predicate: ns.IRAO('hasURL'),
                    objects: [
                        literal(publicationUrl, ns.XSD('anyURI')),
                    ],
                },
                {
                    predicate: ns.IRAO('hasTopic'),
                    objects: [
                        literal(topic),
                    ],
                },
            ],
        },
    ];
    const authors = [
        {
            subject: ns.IRAO_AUTHOR(authorId),
            properties: [
                {
                    predicate: ns.RDF('type'),
                    objects: [
                        ns.OWL('NamedIndividual'),
                        ns.IRAO('Researcher'),
                    ],
                },
                {
                    predicate: ns.FOAF('name'),
                    objects: [
                        literal(authorName, 'en'),
                    ],
                },
                {
                    predicate: ns.IRAO('hasAffiliation'),
                    objects: [
                        ns.IRAO_AFFILIATION(affiliationId),
                    ],
                },
            ],
        },
    ];
    const affiliations = [
        {
            subject: ns.IRAO_AFFILIATION(affiliationId),
            properties: [
                {
                    predicate: ns.RDF('type'),
                    objects: [
                        ns.OWL('NamedIndividual'),
                        ns.IRAO('Affiliation'),
                    ],
                },
                {
                    predicate: ns.FOAF('name'),
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
    const output = rdf.serialize(graph, store, 'http://ontology.ethereal.cz', mediaType);
    fs.writeFileSync(`sample${mediaTypes[mediaType]}`, output);
});
