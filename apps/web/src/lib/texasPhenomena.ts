/**
 * Texas Real-World Phenomena
 *
 * Each phenomenon anchors a specific lesson in a Texas context. Phenomena are
 * observable, place-based events that spark curiosity and connect TEKS content
 * to students' lived experience in Fort Bend ISD and Texas.
 */

export type TexasPhenomenon = {
  /** Unique identifier (matches lesson id) */
  id: string;
  /** Short headline displayed at the top of the banner */
  title: string;
  /** City, region, or landmark in Texas */
  location: string;
  /** One or two sentences describing the observable event/situation */
  description: string;
  /** The guiding question students will answer through the lesson */
  drivingQuestion: string;
  /** TEKS codes this phenomenon directly anchors */
  teks: string[];
  /** Emoji or symbol used as a visual anchor (no image dependency) */
  icon: string;
  /** Additional Texas-specific context (optional) */
  funFact?: string;
};

/**
 * Unit 1 phenomena — Biomolecules and Cells
 */

/** Lesson u1-l1: Biomolecules and Cell Structure (B.5A) */
export const PHENOMENON_U1_L1: TexasPhenomenon = {
  id: "u1-l1-honey",
  title: "Texas Hill Country Honey",
  location: "Texas Hill Country — Fredericksburg & Llano, TX",
  description:
    "Texas is one of the top honey-producing states in the nation. " +
    "In the Hill Country, honeybees visit millions of bluebonnets, Indian paintbrushes, and " +
    "wildflowers each spring. Inside the hive, bees use special enzymes to transform flower " +
    "nectar—a simple sugar solution—into thick, long-lasting honey that contains carbohydrates, " +
    "proteins, lipids, and even trace nucleic acids from pollen grains.",
  drivingQuestion:
    "What types of molecules are found in Texas honey, and why does every living thing—" +
    "from a bluebonnet to a honeybee—need the same four families of biomolecules to survive?",
  teks: ["B.5A"],
  icon: "🍯",
  funFact:
    "A single jar of Texas wildflower honey contains the nectar of approximately 2 million flower visits and traces of every biomolecule class.",
};

/** Lesson u1-l2: Cell Transport and Homeostasis (B.5C, B.11B) */
export const PHENOMENON_U1_L2: TexasPhenomenon = {
  id: "u1-l2-cactus",
  title: "Prickly Pear Cacti Surviving the Texas Drought",
  location: "Big Bend National Park & West Texas Chihuahuan Desert",
  description:
    "During the record-breaking 2022–2023 Texas drought, temperatures in West Texas " +
    "topped 110°F for weeks and rainfall dropped to near zero. Most plants wilted and died, " +
    "but Prickly Pear cacti thrived. Scientists found that cactus cells actively pumped " +
    "water and ions across their membranes to maintain internal balance, even when " +
    "surrounding soil was bone dry.",
  drivingQuestion:
    "Why do Prickly Pear cacti survive extreme Texas heat and drought while most other " +
    "plants die—what is happening inside their cells to keep them alive?",
  teks: ["B.5C", "B.11B"],
  icon: "🌵",
  funFact:
    "Prickly Pear cacti can lose up to 40% of their water content and fully recover once rain returns, thanks to highly regulated cell transport.",
};

/** Lesson u1-l3: Enzymes, Photosynthesis, and Respiration (B.11A) */
export const PHENOMENON_U1_L3: TexasPhenomenon = {
  id: "u1-l3-wildfire",
  title: "Texas Grasslands Regenerating After Wildfire",
  location: "Eastland County, TX — Site of the 2022 Eastland Complex Wildfire",
  description:
    "In March 2022, the Eastland Complex wildfire scorched more than 54,000 acres " +
    "of Texas grassland, leaving only ash and bare soil. Yet within weeks, scientists " +
    "documented new green shoots emerging—plants rebuilding their entire body mass " +
    "using only carbon dioxide from the air, water from the soil, and energy from the " +
    "Texas sun. Simultaneously, soil microbes used the remaining organic material for " +
    "cellular respiration, releasing CO₂ back into the atmosphere.",
  drivingQuestion:
    "How can a completely burned Texas grassland rebuild itself from ash and air? " +
    "Where does all that new plant material actually come from?",
  teks: ["B.11A"],
  icon: "🌾",
  funFact:
    "Scientists used carbon isotope tracing to confirm that over 90% of a plant's dry mass comes from CO₂ in the air—not from the soil.",
};

/**
 * Unit 2 phenomena — Nucleic Acids and Protein Synthesis
 */

/** Lesson u2-l1: DNA Structure and Replication (B.7A) */
export const PHENOMENON_U2_L1: TexasPhenomenon = {
  id: "u2-l1-longhorn",
  title: "No Two Texas Longhorns Look Alike",
  location: "Texas ranches statewide — LBJ Ranch, Gonzales County",
  description:
    "Texas Longhorn cattle are famous for their wild variety of coat patterns: " +
    "solid brown, spotted, brindle, and every combination in between. " +
    "Even calves from the same parents look completely different from each other. " +
    "Geneticists have traced these unique patterns to specific nucleotide sequences " +
    "inherited from Spanish cattle brought to Texas in the 1600s—sequences that have " +
    "been accurately copied and passed down through hundreds of generations.",
  drivingQuestion:
    "Why does every Texas Longhorn have a unique coat pattern, and how is that " +
    "detailed molecular information stored and accurately copied from parent to offspring?",
  teks: ["B.7A"],
  icon: "🐂",
  funFact:
    "The Texas Longhorn genome contains roughly 2.7 billion base pairs—every one must be accurately replicated each time a cell divides.",
};

/** Lesson u2-l2: Transcription and Translation (B.7B) */
export const PHENOMENON_U2_L2: TexasPhenomenon = {
  id: "u2-l2-bluecrab",
  title: "Blue Crabs Turn Red When Cooked",
  location: "Galveston Bay & Texas Gulf Coast",
  description:
    "Blue crabs (Callinectes sapidus) are harvested by the thousands from Galveston Bay " +
    "each summer. Before cooking, their shells are blue-green. The moment they hit boiling " +
    "water, they turn bright red. Scientists discovered that the blue color comes from a " +
    "protein called crustacyanin that grips a red pigment molecule (astaxanthin) and " +
    "changes its shape—and color. Heat destroys the protein, releases the pigment, " +
    "and the crab turns red. Same DNA. Same pigment. Completely different appearance " +
    "depending on whether the protein is folded or not.",
  drivingQuestion:
    "Why do Texas Gulf Coast blue crabs turn red when cooked, and what does this " +
    "tell us about how proteins—built from the instructions in DNA—control what " +
    "living things look and act like?",
  teks: ["B.7B"],
  icon: "🦀",
  funFact:
    "Astaxanthin is also what gives wild-caught Texas Gulf shrimp their pink color after cooking—same phenomenon, same protein-pigment interaction.",
};

/** Lesson u2-l3: Mutations and Their Significance (B.7C) */
export const PHENOMENON_U2_L3: TexasPhenomenon = {
  id: "u2-l3-albino-deer",
  title: "Albino White-Tailed Deer in the Texas Hill Country",
  location: "Llano & Kerr Counties, Texas Hill Country",
  description:
    "Wildlife photographers and hunters occasionally spot ghost-white deer in the " +
    "Texas Hill Country. These rare albino white-tailed deer have a single nucleotide " +
    "change in the gene that codes for tyrosinase, an enzyme responsible for producing " +
    "melanin pigment. Without functional tyrosinase, no pigment is made—so the deer's " +
    "fur, eyes, and hooves are pure white. The same type of mutation affects the " +
    "tyrosinase gene in humans, causing oculocutaneous albinism.",
  drivingQuestion:
    "How can a single change in a single DNA nucleotide cause a white-tailed deer to " +
    "be born completely white—and what does this tell us about when and why DNA mutations matter?",
  teks: ["B.7C"],
  icon: "🦌",
  funFact:
    "Albino deer are estimated to occur in roughly 1 in 20,000 white-tailed deer births in Texas—making each sighting a rare, scientifically significant event.",
};

/**
 * All phenomena indexed by lesson id for fast lookup.
 */
export const TEXAS_PHENOMENA_BY_LESSON: Record<string, TexasPhenomenon> = {
  "u1-l1": PHENOMENON_U1_L1,
  "u1-l2": PHENOMENON_U1_L2,
  "u1-l3": PHENOMENON_U1_L3,
  "u2-l1": PHENOMENON_U2_L1,
  "u2-l2": PHENOMENON_U2_L2,
  "u2-l3": PHENOMENON_U2_L3,
};

/**
 * Returns the Texas phenomenon for a given lesson id, or undefined if none exists.
 */
export function getPhenomenonForLesson(
  lessonId: string,
): TexasPhenomenon | undefined {
  return TEXAS_PHENOMENA_BY_LESSON[lessonId];
}
