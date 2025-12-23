/**
 * Core concepts glossary for "Catching Unicorns"
 * Used to detect and extract key concepts from chunks
 */

export interface Concept {
  term: string;
  aliases: string[];
}

export const CORE_CONCEPTS: Concept[] = [
  {
    term: "Exographics",
    aliases: ["exographic", "exographically", "exographics"],
  },
  {
    term: "e-Class",
    aliases: ["e-class", "E-Class", "eClass"],
  },
  {
    term: "Ideasphere",
    aliases: ["ideasphere", "idea-sphere", "idea sphere"],
  },
  {
    term: "Diaconatic",
    aliases: ["diaconatic", "the diaconatic", "diaconatic loop"],
  },
  {
    term: "Logos",
    aliases: ["logos", "Logos"],
  },
  {
    term: "Praxis",
    aliases: ["praxis", "Praxis"],
  },
  {
    term: "Techno-Literate Culture",
    aliases: [
      "techno-literate",
      "techno-literate culture",
      "technoliterate",
      "techno literate",
    ],
  },
  {
    term: "Reification",
    aliases: ["reification", "reify", "reified", "reifies"],
  },
];

/**
 * Extract key concepts from text by matching against the glossary
 */
export function extractKeyConcepts(text: string): string[] {
  const foundConcepts = new Set<string>();

  for (const concept of CORE_CONCEPTS) {
    // Check main term
    const mainTermPattern = new RegExp(
      `\\b${concept.term.replace(/[-\s]/g, "[\\s-]?")}\\b`,
      "i"
    );
    if (mainTermPattern.test(text)) {
      foundConcepts.add(concept.term);
      continue;
    }

    // Check aliases
    for (const alias of concept.aliases) {
      const aliasPattern = new RegExp(
        `\\b${alias.replace(/[-\s]/g, "[\\s-]?")}\\b`,
        "i"
      );
      if (aliasPattern.test(text)) {
        foundConcepts.add(concept.term);
        break;
      }
    }
  }

  return Array.from(foundConcepts).sort();
}

