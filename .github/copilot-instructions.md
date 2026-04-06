# BioSpark – GitHub Copilot Instructions

> Drop this file at `.github/copilot-instructions.md` in the BioSpark repo.
> Copilot will use it as persistent context for all code suggestions.

---

## 1. Project Identity

**BioSpark** is a high-school Biology learning platform built for FBISD (Fort Bend ISD) students.
It is a Next.js (App Router) application with TypeScript, Tailwind CSS, and a local-first persistence model.
All curriculum content, TEKS standards, vocabulary, learning progressions, and assessment logic must
align with the **FBISD Biology curriculum documents** described in this file.

---

## 2. Curriculum Source of Truth

### Units currently loaded (more units will be added)

| Unit | Title                               | Date Range      | Instructional Days |
| ---- | ----------------------------------- | --------------- | ------------------ |
| 1    | Biomolecules and Cells              | Aug 12 – Sep 18 | 26                 |
| 2    | Nucleic Acids and Protein Synthesis | Sep 10 – Oct 9  | 11                 |
| 7    | Processes in Plants                 | TBD             | 9                  |

> When generating new units, lessons, question banks, or content, always check this file
> for the authoritative concept structure, TEKS codes, vocabulary, and learning progressions.

---

## 3. Unit 1 – Biomolecules and Cells

### Concept Sequence (teach in this order)

1. **Lab Safety** (3 days) — B.1D, B.1B, B.3A
2. **Biomolecules and Cells** (10 days) — B.5A (priority), B.5B (priority)
3. **Cellular Processes** (5 days) — B.5C, B.11B (priority)
4. **Energy Conversions in Cells** (8 days) — B.11A (priority)

### Priority TEKS (bold in curriculum; gate mastery unlock on these)

- `B.5A` – relate functions of carbohydrates, lipids, proteins, nucleic acids to cell structure/function
- `B.5B` – compare/contrast prokaryotic vs eukaryotic cells, including endosymbiotic theory
- `B.11A` – explain matter conservation and energy transfer in photosynthesis & cellular respiration using models/equations
- `B.11B` – investigate/explain the role of enzymes in facilitating cellular processes
- `B.1D` – use appropriate lab tools (microscopes, gel electrophoresis, PCR, etc.)
- `B.1B` – plan and conduct descriptive, comparative, and experimental investigations
- `B.3A` – develop explanations supported by data and models

### Concept 1: Lab Safety

**Learning Intentions:** Explain and follow safety rules as they apply to lab/field investigations.

**Success Criteria (students can):**

- Identify safety equipment in the classroom
- Explain how and when to use safety equipment
- Explain procedures for an injury
- Explain procedures for broken glass/equipment

**Essential Questions:**

- Why is safety important in science?
- Does science have the answer for everything?

**Key Vocabulary:**

- Everyday: rules, safety, flame, fire, sink, protection, long hair, water, footwear, lotion, soap, rag, alcohol
- Academic: laboratory, equipment, field, investigation, horseplay, procedures
- Content-specific: Safety Data Sheet, Fume Hood, Safety Shower, First Aid Kit, Safety Apron, Hazards,
  Flammability, Corrosive, Radioactivity, Disposal, Recycle, Test tubes, Tongs, Fire Blanket

**Common Misconceptions to address in lesson content:**

- Safety equipment is optional or only for specific experiments
- Odorless/harmless-looking chemicals are safe
- Food/drink is allowed in the lab
- Students fear reporting accidents — platform should reinforce psychological safety messaging
- All chemicals behave similarly
- Labels/instructions don't need to be read

### Concept 2: Biomolecules and Cells

**Learning Intentions:**

- Discover the four types of biomolecules in the human body
- Explain how biomolecules are fundamental building blocks of living organisms

**Success Criteria (students can):**

- List the hierarchy of cell specialization: cell → tissue → organ → organ system → organism
- Recognize differences in plant vs animal cells
- Explain specific functions of each biomolecule in cellular context
- Understand carbohydrates are made of subunits (monomers/polymers)
- Explain significance of starch, glycogen, cellulose, and glucose
- Construct models of molecular structures

**Essential Questions:**

- How do the functions of biomolecules determine their roles within a cell?
- What are the key biomolecules that constitute living organisms?
- How do carbohydrates function as energy sources and structural components?
- What is the significance of lipids in membranes, energy storage, and signaling?

**Key Vocabulary:**

- Everyday: critique, consume, component, sustain, sequence, disperse, transmit, falsify, wilt, mechanism,
  regulate, projection, bulk, disruption
- Academic: energy, function, model, organic, structure, synthesis, investigation, permeable, semipermeable
- Content-specific: amino acid, catalyst, carbohydrate, biomolecule, deoxyribose, fatty acid, lipid, enzyme,
  macromolecule, monomer, nucleic acid, nucleotide, nitrogenous base, peptide bond, polymer, nucleus

**Learning Progression:**
| Level | Description |
|-------|-------------|
| Developing | Identifies basic cell structures; recognizes prokaryotic vs eukaryotic categorization |
| Progressing | Describes key differences between cell types; categorizes organisms correctly |
| Proficient | Compares/contrasts complexity; explains endosymbiotic theory |
| Advanced | Analyzes evolutionary significance; connects to biotechnology and medicine |

**Common Misconceptions:**

- All fats are unhealthy
- Protein only comes from animal sources
- Carbohydrates only serve as energy (not structural/signaling)
- DNA is only in the cell nucleus (also in mitochondria; RNA is throughout cell)
- Natural and processed sugars are equivalent
- Biomolecules exist independently (not interconnected)
- Subunits always bond the same way
- Students misidentify elements representing each biomolecule
- Students confuse organelle structure/function with cellular process roles

### Concept 3: Cellular Processes (Homeostasis & Transport)

**Learning Intentions:** Describe how cells maintain homeostasis through cellular transport.

**Success Criteria (students can):**

- Identify examples of active and passive transport
- Explain passive diffusion, facilitated diffusion, active transport, endocytosis/exocytosis
- Explain how cellular transport maintains homeostasis
- Evaluate experimental results and identify sources of error

**Essential Questions:**

- How does transport of molecules into/out of a cell relate to homeostasis?
- What are the different ways substances move into/out of cells?
- How do cellular membranes regulate these processes?

**TEA Boundary for B.11B:** Students are NOT expected to memorize names/functions of specific enzymes
or describe exact mechanisms in Tier 1 instruction.

**Key Vocabulary:**

- Everyday: cells, energy, transform, structure, reaction
- Academic: nucleotide, organelle, enzyme, nucleus, cell membrane, DNA, RNA, plasma membrane
- Content-specific: Golgi apparatus, mitochondria, endoplasmic reticulum, ribosome

**Common Misconceptions:**

- All substances use active transport
- Active transport always moves low → high concentration
- Osmosis only occurs in plant cells
- All molecules freely pass through cell membrane
- Cells always gain water through osmosis

### Concept 4: Energy Conversions in Cells

**Learning Intentions:** Comprehend photosynthesis and cellular respiration as they relate to energy conservation.

**Success Criteria (students can):**

- Write balanced equations for photosynthesis and cellular respiration
- Create models illustrating key steps and components
- Explain matter conservation by tracing atom movement
- Compare/contrast inputs, outputs, energy transformations of both processes
- Apply understanding to explain how these processes support life on Earth

**TEA Boundary for B.11A:** Students are NOT expected to know aerobic vs anaerobic respiration differences
or internal processes like Krebs cycle or electron transport chain in Tier 1.

**Key Vocabulary:**

- Academic: cellular respiration, photosynthesis, glycolysis, mitochondria, homeostasis, autotroph,
  heterotroph, chloroplast, membrane
- Content-specific: feedback mechanism, aerobic respiration, anaerobic respiration, electron transport chain,
  light-dependent reaction, light-independent reaction, fermentation

**Learning Progression:**
| Level | Description |
|-------|-------------|
| Developing | Recognizes matter/energy in both processes; states energy comes from sun/food |
| Progressing | Describes how matter/energy move; explains reactants/products |
| Proficient | Uses balanced equations; demonstrates matter conservation; uses models to compare |
| Advanced | Applies to ecosystems; analyzes disruptions (deforestation, cellular dysfunction) |

**Common Misconceptions:**

- All energy comes directly from food (not from ATP conversion)
- ATP is stored long-term
- Mitochondria are the sole energy producers
- Energy is not released during photosynthesis (it's stored as glucose; released in respiration)
- More food consumed = more energy produced

---

## 4. Unit 2 – Nucleic Acids and Protein Synthesis

### Concept Sequence (teach in this order)

1. **DNA, RNA, and Protein Synthesis** (7 days) — B.7A, B.7C (priority)
2. **Gene Expression** (4 days) — B.7B (priority)

### Priority TEKS

- `B.7A` – identify DNA components; explain how nucleotide sequence specifies traits; examine scientific explanations for DNA origin
- `B.7B` – describe significance of gene expression; explain protein synthesis using DNA/RNA models
- `B.7C` – identify and illustrate changes in DNA; evaluate significance of those changes

**TEA Boundary for B.7C:** Students are NOT expected to understand chromosomal mutations in Tier 1.

### Concept 1: DNA, RNA, and Protein Synthesis

**Learning Intentions:**

- How nucleotide sequence specifies traits (central dogma)
- Scientific explanations for DNA origin
- How cells undergo protein synthesis to form polypeptides

**Success Criteria (students can):**

- State and identify molecules in a DNA nucleotide in a diagram
- State and identify molecules in an RNA nucleotide in a diagram
- Name the four types of RNA
- Describe three differences between RNA and DNA
- Name the type of bond on the DNA backbone
- Describe base pairing rules for DNA (A-T, C-G)
- Describe the role of hydrogen bonds in DNA structure
- Describe stages of DNA replication
- Explain the role of enzymes (Helicase, DNA Polymerase) in replication
- Explain and demonstrate transcription and translation using a model
- Transcribe mRNA from a DNA strand using base pairing rules
- Use a codon chart to determine protein sequence from mRNA
- Explain how different proteins can be expressed from one gene
- Define a gene mutation
- Describe two possible effects of nucleotide insertions and deletions
- Explain what is involved in thermal cycling of PCR

**Key Vocabulary:**

- Everyday: human being, characteristic, traits, appearance, offspring
- Academic: DNA, RNA, genetic code, chromosome, nucleus, nucleic acid, gene, test tube,
  monomer, polymer, nucleotide, polypeptide
- Content-specific: transcription, translation, codon, anticodon, antiparallel, base pairs,
  central dogma, double helix, mRNA, tRNA, rRNA, helicase, DNA polymerase, RNA polymerase

**Learning Progression:**
| Level | Description |
|-------|-------------|
| Developing | Recognizes DNA can change; identifies basic mutation types with limited explanation |
| Progressing | Illustrates how sequence changes alter proteins; connects to genetic disorders |
| Proficient | Models mutation types; predicts impact on gene expression/protein structure |
| Advanced | Assesses significance in evolution/biotech; interprets genomics/CRISPR case studies |

**Common Misconceptions:**

- DNA is only composed of nucleotides (overlooks sugar-phosphate backbone role)
- Nitrogenous bases in DNA are interchangeable (base pairing is complementary: A-T, C-G)
- Students confuse hydrogen bonds vs covalent bonds in double helix
- All DNA codes for proteins (some is regulatory, non-coding, or repetitive)
- Any mutation always produces visible phenotype change
- DNA has always existed in its current form

### Concept 2: Gene Expression

**Learning Intentions:**

- Examine steps in gene expression to recognize normal vs abnormal cellular processes
- Explain how different proteins can be expressed from one gene

**Success Criteria (students can):**

- Explain mechanism by which different proteins can be expressed from one gene
- Define a gene mutation
- Describe two possible effects of nucleotide insertions and deletions
- Articulate importance of gene expression in cellular function, development, and environmental response
- Understand gene expression involves transcription (DNA → RNA) and translation (RNA → protein)
- Recognize gene expression is regulated (activated or repressed in specific contexts)

**Key Vocabulary:**

- Everyday: protein, characteristics, traits, regulate, process, offspring, replicate
- Academic: mutation, gene, cancer, chromosome, DNA, RNA, transcription, translation
- Content-specific: gene expression, genome, lac operon, epigenetics, genotype, phenotype,
  promoter, mutation, point mutation, frameshift mutation, missense mutation

**Learning Progression:**
| Level | Description |
|-------|-------------|
| Developing | Identifies genes as DNA segments for traits; recognizes RNA in protein production |
| Progressing | Describes transcription/translation; identifies mRNA/tRNA/rRNA roles |
| Proficient | Explains full process with models; connects gene expression to observable traits |
| Advanced | Evaluates regulatory mechanisms; applies to genetic diseases/mRNA vaccines |

**Common Misconceptions:**

- Gene expression = only making proteins (also includes transcription, RNA processing, post-translational mods)
- DNA directly codes proteins (mRNA is the intermediary)
- RNA and DNA are identical molecules (RNA is single-stranded, uses ribose and uracil)
- Genetic code is always read the same way (exceptions and context-dependent variations exist)
- Each gene codes for a single protein (alternative splicing produces isoforms)
- All mutations change protein sequence (silent, missense, and nonsense mutations differ)

---

## 5. BioSpark Platform Architecture Reference

When generating code, always respect this existing route/component structure:

### Routes

```
/student/dashboard              — mastery donut, TEKS color key, quick links
/student/learning-hub           — standalone learning hub
/student/learn                  — curriculum roadmap hub
/student/learn/[unitId]         — unit chapter page
/student/learn/[unitId]/[lessonSlug] — lesson runtime/player
/student/assignments            — assignment list with filters
/student/learn/standards        — TEKS heatmap + weakest standards
/student/learn/interventions    — intervention queue
/student/guardian               — parent snapshot
/student/profile                — student mastery surface
/teacher/dashboard              — teacher entry point
/teacher/learning-controls      — unit visibility, pacing, period playlists
/teacher/learning-analytics     — funnel + stuck-point analytics
/teacher/import-curriculum      — JSON import validator
/teacher/content-quality        — versioning/approval/changelog
```

### API Routes

```
/api/mastery
/api/assignments
/api/assignments/[assignmentId]/responses
/api/assignments/[assignmentId]/summary
/api/check
/api/attempts
/api/score/cer
/api/score/short
/api/student/validate-name
/api/translate
/api/health
```

### Key Existing Capabilities

- Mastery visualization: adaptive donut/ring using TEKS/unit proficiency data
- Learning progress: stored locally (percent complete, check score, attempts, time spent, last visited)
- Learning settings: stored locally (visible units, pacing mode, playlists by class period)
- Lesson player: section completion, quick-check scoring, attempts, completion gating, read-aloud
- TEKS heatmap generation and weakest-TEKS identification
- Intervention queue generation
- Learning funnel/stuck-point computations
- Guardian snapshot computations
- Lesson unlock logic based on prior mastery/progress

---

## 6. Content Generation Rules

When Copilot generates lesson content, questions, or explanations, follow these rules:

### Question generation

- Always tag questions with the correct TEKS code (e.g., `teks: "B.5A"`)
- Include a `learningLevel` field: `"developing" | "progressing" | "proficient" | "advanced"`
- Include a `conceptId` matching the unit/concept structure above
- For misconception-targeting questions, add `misconceptionTarget: true` and specify which misconception

### Lesson content TypeScript interface

```ts
interface Lesson {
  id: string;
  unitId: string; // e.g., "unit-1"
  conceptId: string; // e.g., "concept-2-biomolecules"
  slug: string;
  title: string;
  teks: string[]; // e.g., ["B.5A", "B.5B"]
  isPriorityTEKS: boolean;
  gradingPeriod: number;
  learningIntentions: string[];
  successCriteria: string[];
  vocabulary: {
    everyday: string[];
    academic: string[];
    contentSpecific: string[];
  };
  misconceptions: string[];
  sections: LessonSection[];
  quickChecks: QuickCheck[];
  interventionTier: 2 | 3 | null;
}
```

### Vocabulary display

- Always display vocabulary in three tiers: Everyday Language, Academic Words, Content Specific
- Content-specific vocabulary should be highlighted/bolded in lesson text on first use

### Learning progression gating

- Students at "developing" level should NOT see advanced content
- Lesson unlock logic must check prior mastery before revealing next lesson
- Priority TEKS (`B.5A`, `B.5B`, `B.11A`, `B.11B`, `B.7A`, `B.7B`, `B.7C`) gate unit completion

### Intervention triggers

- Trigger Tier 2 intervention if student scores < 70% on a concept quick-check
- Trigger Tier 3 intervention if student scores < 50% or has 2+ failed attempts
- Intervention content should map to the curriculum-specified strategies:
  - Tier 2: graphic organizers, concept maps, model building
  - Tier 3: one-on-one tutoring scaffolds, sentence starters, simplified materials

### Assessment alignment

- All formative tasks must align to the concept's culminating formative task structure
- CER (Claim-Evidence-Reasoning) scoring is available via `/api/score/cer`
- Short-answer scoring via `/api/score/short`

---

## 7. TEKS Reference Quick-Lookup

| Code  | Skill Verb(s)                                                                                               | TEA Priority         |
| ----- | ----------------------------------------------------------------------------------------------------------- | -------------------- |
| B.1A  | Ask questions, define problems                                                                              | SEP                  |
| B.1B  | Plan and conduct investigations                                                                             | SEP (Priority)       |
| B.1D  | Use appropriate lab tools                                                                                   | SEP (Priority)       |
| B.1G  | Develop and use models                                                                                      | SEP                  |
| B.2A  | Identify model advantages/limitations                                                                       | SEP                  |
| B.3A  | Develop explanations with data/models                                                                       | SEP (Priority)       |
| B.3B  | Communicate explanations                                                                                    | SEP                  |
| B.5A  | Relate biomolecule functions to cell structure                                                              | **Priority Content** |
| B.5B  | Compare prokaryotic vs eukaryotic cells                                                                     | **Priority Content** |
| B.5C  | Investigate homeostasis through transport                                                                   | Content              |
| B.7A  | Identify DNA components; explain nucleotide sequence                                                        | Content              |
| B.7B  | Describe gene expression; explain protein synthesis                                                         | **Priority Content** |
| B.7C  | Identify/illustrate DNA changes; evaluate significance                                                      | **Priority Content** |
| B.11A | Explain matter conservation in photosynthesis/respiration                                                   | **Priority Content** |
| B.11B | Investigate/explain enzyme roles                                                                            | **Priority Content** |
| B.12B | Explain interactions among plant transport, reproduction, and response systems as facilitated by structures | **Priority Content** |
| B.8B  | Genetic inheritance — predict outcomes of monohybrid/dihybrid crosses including non-Mendelian traits        | **Priority Content** |
| B.7D  | Molecular technologies — discuss PCR, gel electrophoresis, genetic engineering; applications focus          | Content              |

---

## 8. Coding Conventions for BioSpark

- **Framework:** Next.js 14+ App Router, TypeScript strict mode
- **Styling:** Tailwind CSS utility classes only (no arbitrary values unless necessary)
- **State:** Local-first via `localStorage` wrappers; do not add external DB calls without existing API routes
- **Components:** Server components by default; add `"use client"` only when interactivity requires it
- **Data fetching:** Use existing API routes — do not create new DB schemas without teacher approval
- **TEKS tags:** Always use the canonical string format `"B.5A"` (not `"b5a"`, `"B5A"`, etc.)
- **Unit IDs:** Use kebab-case: `"unit-1"`, `"unit-2"` etc.
- **Lesson slugs:** Use kebab-case matching the concept: `"lab-safety"`, `"biomolecules-intro"`, `"cell-transport"`, etc.
- **Accessibility:** All interactive elements must have ARIA labels; use semantic HTML
- **Dark mode:** All new UI must support dark mode via existing theme tokens
- **Do not** hardcode student names, scores, or class data — use mock data utilities or API hooks

---

## 9. Unit 7 - Processes in Plants

**Instructional Days:** 9 (includes 2 re-engagement days)
**TEKS:** B.12B - explain how the interactions that occur among systems that perform functions of transport, reproduction, and response in plants are facilitated by their structures
**Priority TEKS:** B.12B
**SEPs:** B.1A, B.1E, B.1G, B.2A, B.2B, B.3A, B.4B
**RTCs:** System and Systems Models, Cause and Effect, Patterns
**ELPS:** 2H, 3J

---

### Concept Sequence

1. Introduction to Plant Systems and Structures
2. Transport System (Vascular System)
3. Reproductive System in Plants
4. Response System (Tropisms and Hormones)
5. Integration of Systems

- How Transport Supports Reproduction and Response
- How Reproduction Relies on Transport and Response
- How Response Affects Transport and Reproduction

---

### Essential Questions

- How do the structures of plant systems (transport, reproduction, and response) work together to support the overall survival and growth of a plant?
- In what ways do plant structures enable the plant to adapt to environmental changes and ensure successful reproduction?
- How do disruptions in one plant system affect other systems?

### Big Ideas

- **Plant Systems Are Interdependent:** Transport, reproductive, and response systems rely on each other to ensure survival, growth, and reproduction.
- **Structural Adaptations Facilitate Function:** Specialized tissues (xylem, phloem, stomata, guard cells) enable efficient function across systems.
- **Environmental Interactions Drive Internal Plant Responses:** Light, gravity, and touch trigger hormonal responses that coordinate growth, reproduction, and health.

---

### Learning Intentions & Success Criteria

**Students will learn:** How do the structures of plant systems facilitate the interactions needed for transport, reproduction, and response to the environment?

**Students can:**

- Identify and describe the major plant systems involved in transport, reproduction, and response
- Explain how xylem and phloem function in transporting water, nutrients, and sugars
- Describe the structures of flowers and how they facilitate reproduction (pollination, fertilization, seed dispersal)
- Explain how plant hormones (auxins, gibberellins, ethylene) regulate growth, development, and responses to environmental stimuli
- Analyze the role of tropisms (phototropism, gravitropism, thigmotropism) in plant responses to environmental changes
- Illustrate and explain how transport, reproductive, and response systems work together
- Apply knowledge to predict how disruptions in one system might affect the others

---

### Learning Progression

| Level           | Description                                                                                                                                                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Developing**  | Identify major plant structures and recognize that plants have systems performing essential functions                                                                                                                               |
| **Progressing** | Describe basic structures in transport, reproduction, and response; describe basic plant reproduction                                                                                                                               |
| **Proficient**  | Explain how the vascular system facilitates transport; connect how reproductive structures rely on transport and response; describe stages of sexual reproduction; articulate system interactions                                   |
| **Advanced**    | Explain intricate water/nutrient transport mechanisms (transpiration, cohesion-tension, pressure-flow); analyze alternation of generations; explain signal transduction pathways and hormone regulation (auxins, gibberellins, ABA) |

---

### Vocabulary

**Everyday Language:** Oxygen, Carbon Dioxide, Cells, Sunlight, Land, Cycle, Gas

**Academic Words:** Chloroplast, Sporophyte, Gametophyte, Plants, Monocot, Dicot, Angiosperm, Tissue, Stem, Meristem

**Content Specific:** Photosynthesis, Cellular Respiration, Transpiration, Germination, Pollination, Fertilization, Seed Dispersal, Xylem, Phloem, Stomata, Cuticle, Vascular Bundle, Auxin, Gibberellins, Phototropism, Gravitropism, Thigmotropism

---

### TEA Instructional Boundary

- **Tier 1:** Students are NOT expected to memorize all types of asexual reproduction.

---

### Key Misconceptions

1. Water and nutrients are transported through plants only by the roots -> Xylem carries water up from roots to leaves
2. Plants only use one type of tissue for transport -> Both xylem (water/minerals) and phloem (sugars) are required
3. Pollination and fertilization are the same process -> Pollination = pollen transfer; fertilization = gamete fusion
4. Flowers are necessary for all plant reproduction -> Asexual reproduction (vegetative propagation) does not require flowers
5. Plant responses to stimuli are solely physical changes -> Hormones (e.g., auxins) regulate internal cell responses
6. Roots are the only part that responds to gravity -> Both roots (downward) and stems (upward) exhibit gravitropism
7. Transpiration is wasteful -> Essential for water/nutrient transport and temperature regulation
8. Plants can grow and reproduce without environmental signals -> Light, temperature, and humidity regulate flowering/growth cycles
9. Hormones only influence growth in one direction -> Auxins regulate both phototropism and gravitropism; gibberellins regulate germination and elongation
10. Phloem transport is driven solely by plant energy -> Driven by turgor pressure differences between source and sink (pressure-flow model)
11. Plants only need one type of response system -> Multiple tropisms and hormone types are required for survival

---

### Intervention Strategies

**Tier 2:**

- Plant Structure and Function Match-Up (card sort)
- Interactive Plant Diagram Labeling (worksheets)
- Plant System Flowchart (pairs activity)

**Tier 3:**

- Scaffolded Graphic Organizer: Breaking Down Plant Systems (partially completed, with sentence stems)
- Close Reading with Guided Questions (simplified text, section-by-section)
- Step-By-Step Diagram Building with Sentence Frames

**Sentence frames for emergent bilinguals:**

- "The **\_ helps the plant by \_\_**, which supports the function of \_\_\_."
- "When **_ happens, the _** system interacts with the **_ system to help the plant _**."
- "The phloem transports... which helps the..."

---

### Enrichment Activities

**Tier 2:**

- Case Study Analysis: How Plants Adapt to Extreme Environments (desert, aquatic, carnivorous plants)
- Investigative Lab: Measuring and Modeling Transpiration Rates (plastic bag enclosures, variable conditions)

**Tier 3:**

- Plant Systems Engineering: Designing a Bioengineered Plant for Space Colonization
- Experimental Research: Investigating Chemical Communication in Plants (ethylene, auxin, mechanical stress experiments)

---

## 10. Unit 4 – Genetic Diversity

**Timeframe:** GP2 November 18 – December 19 (19 total school days) + GP3 January 8 – January 26 (12 total school days)
**Instructional & Re-engagement Days:** 11 days per grading period
**TEKS (Content):** B.8B (priority), B.7D
**SEPs:** B.1A, B.1B, B.1C, B.1D, B.1F, B.1G, B.2A, B.3B, B.3C, B.4B, B.4C
**ELPS:** 2H, 3J
**RTCs:** Patterns

---

### Concept 1: Inherited Traits (11 days)

**Concept Sequence:**
1. Heredity and basic genetic concepts
2. Mendelian inheritance
3. Non-Mendelian inheritance (incomplete dominance, codominance, multiple alleles)
4. Sex-linked traits
5. Monohybrid and dihybrid crosses
6. Meiosis in the context of genetic inheritance
7. Mutations and their effects on inheritance

**Learning Intention:**
Students will learn to predict and analyze the possible outcomes of various genetic combinations using monohybrid and dihybrid crosses, including both Mendelian and non-Mendelian inheritance patterns.

**Success Criteria — students can:**
- Accurately define and differentiate between Mendelian and non-Mendelian inheritance patterns such as incomplete dominance, codominance, sex-linked traits, and multiple alleles
- Predict the phenotypic and genotypic outcomes of monohybrid and dihybrid crosses by applying Mendelian genetics and extending to non-Mendelian traits
- Explain how specific patterns of inheritance contribute to genetic diversity and apply to real-world examples
- Construct and interpret Punnett squares for monohybrid and dihybrid crosses, correctly identifying genotypic and phenotypic ratios
- Use scientific reasoning to support predictions and explain genetic outcomes with evidence from genetic principles
- Recognize and explain patterns of inheritance by identifying trends and relationships within genetic data

**Big Ideas:**
- The outcomes of genetic crosses involving one or two traits can be predicted using mathematical models such as Punnett squares and the Law of Probability
- We predict genetic crosses to better understand inheritance of traits, whether favorable or detrimental
- Genetic traits are passed from parents to offspring through predictable patterns that can be explained by fundamental principles of genetics

**Essential Questions:**
- How can the outcomes of genetic crosses be predicted?
- Why do we predict the outcome of genetic crosses?
- How do Mendel's laws of inheritance explain the way traits are passed from one generation to the next?
- What role does probability play in predicting genetic outcomes, and how can we use it to understand genetic variation within populations?

**Learning Progression:**

| Level | Description |
|-------|-------------|
| **Developing** | Understand basic components of heredity and genetic inheritance (genes, alleles, chromosomes). Demonstrate understanding of DNA structure and function. |
| **Progressing** | Express genotypic and phenotypic ratios mathematically as ratios, percentages, or fractions. Express dominant alleles with capital letters and recessive with lowercase. Explain autosomes and sex chromosomes (XY male, XX female). Define homologous chromosome, chromatid, centromere. |
| **Proficient** | Apply Mendel's laws to predict genetic outcomes: Law of Segregation, Law of Independent Assortment, monohybrid and dihybrid crosses. Explain non-Mendelian inheritance (incomplete dominance, codominance, multiple alleles, polygenic inheritance). Describe sex-linked trait inheritance. |
| **Advanced** | Describe and predict inheritance patterns for multiple alleles (ABO blood groups). Describe epistasis effects on gene expression. Explain how environmental influences affect gene expression. |

**Key Vocabulary:**

- Everyday: division, combine, material, analysis, experiment, model, pairs, features, instructions, probability
- Academic: offspring, gene, trait, heredity, inherited, chromosome
- Content-specific: allele, meiosis, monohybrid cross, dihybrid cross, phenotype, genotype, Punnett square, codominance, incomplete dominance, homozygous, heterozygous, sex-linked trait, gamete, law of segregation

**Common Misconceptions:**
1. Dominant alleles are more common than recessive alleles → dominance refers to how alleles interact, not frequency in a population
2. A 3:1 ratio is always expected in monohybrid crosses → 3:1 is specific to heterozygous × heterozygous with complete dominance; other crosses yield different ratios
3. Incomplete dominance and codominance are the same → incomplete dominance = blended intermediate phenotype; codominance = both alleles fully and separately expressed
4. All traits are inherited through Mendelian patterns → non-Mendelian traits (incomplete dominance, codominance, multiple alleles, sex-linked) require different considerations
5. Punnett squares show actual outcomes, not just probabilities → Punnett squares represent probability, not certainty
6. Sex-linked traits are only found on the Y chromosome → most sex-linked traits are X-linked; X-linked recessive traits more common in males (XY) who have only one X
7. In a dihybrid cross, each trait is inherited independently without exception → law of independent assortment applies only to genes on different chromosomes or far apart; linked genes may be inherited together
8. If a trait is dominant, it will always be the most common in a population → trait frequency is influenced by selection pressure, genetic drift, and mutation, not just dominance
9. Traits controlled by multiple alleles have more than two alleles in each individual → individuals carry only two alleles; multiple alleles refers to population-level variation
10. Heterozygous individuals will always show the dominant phenotype → true only for complete dominance; not for incomplete dominance or codominance

**Intervention Strategies:**

Tier 2: Structured practice with guided handouts (step-by-step Punnett square setup); interactive Punnett square simulations with immediate feedback; color coding to differentiate dominant/recessive alleles

Tier 3: One-on-one instruction starting with simple monohybrid crosses; manipulatives (colored beads/cards) to model genetic crosses; scaffolded problem solving with gradually reduced support; guided questioning to reinforce learning aloud

---

### Concept 2: Molecular Technologies (6 days)

**Concept Sequence:**
1. DNA structure and functions review
2. Basic molecular biology techniques: DNA extraction, gel electrophoresis, PCR
3. Genetic engineering fundamentals: restriction enzymes, DNA ligase, plasmids/vectors
4. Recombinant DNA technology
5. DNA sequencing
6. Biotechnology applications

**Learning Intention:**
Students will explore and understand the significance of molecular technologies, including polymerase chain reaction (PCR), gel electrophoresis, and genetic engineering.

**Success Criteria — students can:**
- Understand and explain the principles and applications of PCR, gel electrophoresis, and genetic engineering techniques
- Describe the importance of these molecular technologies in current research and engineering practices
- Demonstrate basic knowledge of the steps involved in each technique and their purposes
- Connect the applications of these technologies to fundamental concepts in DNA structure, replication, and gene expression
- Interpret and analyze data generated from molecular techniques such as gel electrophoresis results

**Big Ideas:**
- Molecular technologies like PCR, gel electrophoresis, and genetic engineering are foundational tools in modern biology and biotechnology
- PCR enables amplification of specific DNA sequences from small samples; revolutionized genetics, diagnostics, and forensics
- Gel electrophoresis separates DNA fragments by size; essential for genetic research, DNA fingerprinting, and disorder diagnosis
- Genetic engineering allows modification of an organism's DNA; applications include GMOs, gene therapy, and synthetic biology

**Essential Questions:**
- How do molecular technologies like PCR, gel electrophoresis, and genetic engineering revolutionize our understanding and manipulation of genetic material?
- In what ways do PCR and gel electrophoresis enable scientists to analyze and interpret genetic information?
- What are the potential benefits and risks of genetic engineering in agriculture, medicine, and environmental management?
- How do molecular technologies contribute to advancements in personalized medicine and new treatments for diseases?

**Learning Progression:**

| Level | Description |
|-------|-------------|
| **Developing** | Demonstrate understanding of DNA structure and function. Identify basic molecular biology techniques such as DNA extraction. |
| **Progressing** | Describe restriction enzymes and their role in cutting DNA. Explain DNA ligase and its role in joining DNA fragments. Describe purpose of plasmids and vectors in genetic engineering. |
| **Proficient** | Explain how mutations can lead to genetic disorders. Examine how modern technologies are used to study and manipulate genetics. Describe applications of DNA sequencing, genomics, genetic engineering, and CRISPR. Discuss ethical implications of genetic research. |
| **Advanced** | Perform and explain principles behind DNA extraction, gel electrophoresis, and PCR; understand their applications in research and diagnostics. Use bioinformatics tools to analyze genomic data and identify genes. |

**Key Vocabulary:**

- Everyday: test, data, table, experiment, write, notebook, strategy, record
- Academic: genetics, informatics, chromosome, gene, DNA, RNA, molecule
- Content-specific: polymerase chain reaction, gel electrophoresis, microcentrifuge, agar, biotechnology, nanotechnology, genetic engineering, CRISPR, thermocycler

**Common Misconceptions:**
1. PCR can copy entire genomes → PCR amplifies only specific target sequences defined by primers
2. Gel electrophoresis shows the DNA sequence → gel electrophoresis only separates by size; sequencing requires additional techniques
3. Genetic engineering creates "super" organisms → genetic engineering involves precise, targeted modifications with specific, controlled outcomes
4. PCR is solely a diagnostic process → PCR's primary function is amplifying DNA; diagnostic use is one application
5. Gel electrophoresis can identify specific genes → it separates by size only; identifying specific genes requires further analysis
6. Genetic engineering is the same as cloning → genetic engineering alters genes; cloning creates a genetically identical copy
7. Genetic engineering has no ethical concerns → raises significant ethical questions including human gene editing and GMO environmental impacts
8. PCR and gel electrophoresis are outdated technologies → remain foundational and extensively used in research and clinical labs
9. Genetic engineering is just for agriculture → also crucial in medicine, gene therapy, vaccine development, and environmental science
10. All genetic modifications are safe → modifications can have unintended consequences; safety assessments and regulations are essential

**Intervention Strategies:**

Tier 2: Guided practice with interactive online simulations (Learn Genetics by University of Utah); small group instruction on core concepts with concrete examples; scaffolded hands-on lab using non-hazardous materials (food coloring for gel electrophoresis simulation)

Tier 3: One-on-one instruction with simplified language and real-life analogies; multi-sensory learning (tactile models, videos, interactive software); concept reinforcement through analogies (PCR = photocopying a specific book page; gel electrophoresis = sorting objects by size)

---

## 11. Upcoming Units (stubs - curriculum docs not yet uploaded)

These units will be added to the curriculum as documents are provided.
Generate placeholder route stubs only - do not generate lesson content without curriculum docs.

| Unit | Placeholder Title |
| ---- | ----------------- |
| 3    | Cell Cycle (stub) |
| 5    | (TBD)             |
| 6    | (TBD)             |
| 8    | (TBD)             |

---

## 12. Pull Request Standards

Every PR that touches UI must include visual documentation in the description. When drafting or reviewing a PR, always include a **Visual changes** section and prompt the author to fill it in with a screenshot or screen recording before merging.

For new components, the visual documentation should show at minimum the default/empty state and one populated or interactive state. For changes that affect both the student and teacher experience, show both.

When generating a PR description, flag any UI files changed in the diff and explicitly remind the author which views need to be screenshotted. If the change is subtle — a spacing fix, a color change, a loading state — note that in the PR description so reviewers know what to look for.

---

## 13. Hard Constraints - Do Not Violate

- Do not generate lesson content that contradicts the TEA Boundaries specified above
- Do not require students to know aerobic vs anaerobic respiration details, Krebs cycle, or ETC in Tier 1
- Do not require memorization of specific enzyme names/mechanisms in Tier 1 (B.11B boundary)
- Do not require understanding of chromosomal mutations in Tier 1 (B.7C boundary)
- Do not invent TEKS codes — use only codes listed in this file
- Do not skip the misconception layer in lesson content — it is required by curriculum design
- Do not flatten the three-tier vocabulary structure
- Do not bypass lesson unlock logic — students must meet mastery thresholds to progress
