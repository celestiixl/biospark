export interface DailyWonder {
  id: number;
  fact: string;
  learnMore: {
    title: string;
    body: string[];
    teks: string[];
  };
}

export const dailyWonders: DailyWonder[] = [
  {
    id: 1,
    fact: "A single teaspoon of soil from a Texas backyard contains more living organisms than there are people on Earth.",
    learnMore: {
      title: "What lives in soil?",
      body: [
        "Soil looks like dirt but it is actually one of the most densely populated ecosystems on the planet. In a single teaspoon you can find bacteria, fungi, protozoa, nematodes, and more, all invisible to the naked eye, all doing specific jobs. Bacteria break down dead material. Fungi connect plant roots. Protozoa eat bacteria and release nutrients plants need.",
        "This matters for biology because soil ecosystems follow the same rules as every other ecosystem: energy flows, matter cycles, and every organism has a role. Disrupt one layer and the whole system feels it. Texas agriculture, ranching, and native plant life all depend on healthy soil communities most people never think about."
      ],
      teks: ["B.4A", "B.4B", "B.2A"]
    }
  },
  {
    id: 2,
    fact: "Your heart will beat around 100,000 times today without you thinking about it once.",
    learnMore: {
      title: "How does your heart know what to do?",
      body: [
        "Your heart has its own built-in electrical system called the sinoatrial node, sometimes called the natural pacemaker. It sends an electrical signal that travels through your heart muscle in a precise sequence, causing the chambers to contract in the right order, at the right time, every single beat. You never have to remind it. Your nervous system can speed it up or slow it down, but it runs on its own.",
        "What makes this remarkable is that heart muscle cells are different from almost any other cell in your body. They are designed to contract rhythmically and are so specialized that they cannot be easily replaced if damaged. This is why heart disease is so serious and why scientists studying cell differentiation are working to understand how to regenerate cardiac tissue."
      ],
      teks: ["B.5A", "B.12A"]
    }
  },
  {
    id: 3,
    fact: "The Gulf Coast's sea turtles navigate thousands of miles using a magnetic map they are born with.",
    learnMore: {
      title: "How do sea turtles find their way?",
      body: [
        "Sea turtles have magnetite crystals in their brains that allow them to detect the Earth's magnetic field like a built-in compass. But they do not just use direction. They can read both the intensity and the angle of the magnetic field, which gives them a two-dimensional coordinate system. They use this to navigate open ocean with precision that still surprises researchers.",
        "Female sea turtles return to the exact beach where they were born to lay their own eggs, sometimes after traveling thousands of miles across the Gulf of Mexico and Atlantic. This behavior is called natal homing and it is encoded in their biology, not learned. Texas beaches, particularly around Padre Island, are nesting sites for Kemp's ridley sea turtles, one of the most endangered sea turtle species in the world."
      ],
      teks: ["B.9C", "B.4B", "B.2A"]
    }
  },
  {
    id: 4,
    fact: "A monarch butterfly passing through Texas has never made this migration before. It just knows the way.",
    learnMore: {
      title: "How does a monarch know where to go?",
      body: [
        "Monarchs that migrate through Texas each fall are the great-grandchildren of the butterflies that made the same journey the previous year. No individual monarch lives long enough to make a round trip. Yet each new generation navigates to the same overwintering sites in central Mexico using a time-compensated sun compass, an internal clock that adjusts their flight direction based on the sun's position throughout the day.",
        "Scientists believe the navigation system is encoded in monarch DNA and expressed through structures in the brain and antennae. It is one of the most studied examples of innate behavior in insects. Texas sits directly in the monarch migration corridor, making it one of the best places in the world to observe this phenomenon every October."
      ],
      teks: ["B.9C", "B.7A", "B.4B"]
    }
  },
  {
    id: 5,
    fact: "The DNA in one of your cells, uncoiled, would be about 6 feet long. You have 37 trillion cells.",
    learnMore: {
      title: "How does that much DNA fit inside a cell?",
      body: [
        "A human cell is about 10 micrometers across, roughly one tenth the width of a human hair. Yet it contains approximately 6 feet of DNA. This is only possible because of a sophisticated packaging system. DNA wraps around proteins called histones, which coil into structures called nucleosomes, which fold further into chromatin, which condenses into the chromosomes visible under a microscope during cell division.",
        "This packaging is not just for storage. How tightly DNA is wound determines whether genes can be read or not. Loosely packed DNA is accessible to the cellular machinery that reads genes. Tightly packed DNA is silenced. This is one of the ways your cells control which genes are active without changing the DNA sequence itself, a field called epigenetics."
      ],
      teks: ["B.7A", "B.6A", "B.5A"]
    }
  },
  {
    id: 6,
    fact: "Tardigrades are microscopic animals that can survive in outer space. They probably exist in your backyard.",
    learnMore: {
      title: "What is a tardigrade?",
      body: [
        "Tardigrades, sometimes called water bears, are eight-legged microscopic animals less than 1mm long. They live in water droplets on moss, soil, and leaf litter, including in Texas backyards. What makes them remarkable is their ability to survive conditions that would kill almost any other living thing: extreme heat, freezing temperatures, radiation, and even the vacuum of outer space.",
        "They do this through a process called cryptobiosis, where they essentially shut down all metabolic activity, curl into a tiny ball called a tun, and wait out the hostile conditions. When water returns, they wake back up. Scientists have revived tardigrades that were frozen for over 30 years."
      ],
      teks: ["B.9C", "B.4B", "B.5A"]
    }
  },
  {
    id: 7,
    fact: "A hummingbird's heart beats 1,200 times per minute during flight.",
    learnMore: {
      title: "Why does a hummingbird's heart beat so fast?",
      body: [
        "Hummingbirds have the highest metabolism of any warm-blooded animal on Earth. Hovering in place requires enormous energy because their wings beat up to 80 times per second. To fuel that, their cells need oxygen delivered constantly and rapidly, which means the heart has to pump at an extraordinary rate. A resting hummingbird drops to around 250 beats per minute. At night they enter a state called torpor where their heart rate drops even further to conserve energy.",
        "The ruby-throated hummingbird passes through Texas during migration, and the black-chinned hummingbird breeds here in summer. Their hearts are proportionally the largest of any bird relative to body size. This is a clear example of how structure matches function at the organ level: a high-demand lifestyle requires a high-performance cardiovascular system."
      ],
      teks: ["B.5A", "B.12A", "B.9C"]
    }
  },
  {
    id: 8,
    fact: "Your body replaces most of its cells every 7 to 10 years. You are not the same physical person you were as a child.",
    learnMore: {
      title: "Which cells get replaced and which ones do not?",
      body: [
        "Different cells in your body have very different lifespans. Red blood cells live about 120 days. The cells lining your gut are replaced every 3 to 5 days. Skin cells last about 2 to 3 weeks. Fat cells stick around for about 8 years. Some cells, like most neurons in your cerebral cortex, are with you for your entire life and are never replaced.",
        "This constant turnover is driven by cell division, specifically mitosis, where one cell splits into two identical daughter cells. The process is tightly regulated. When cells divide too fast or at the wrong time, the result can be cancer. When they stop dividing too early or die off faster than they are replaced, tissues break down. The balance between cell growth and cell death is one of the most fundamental processes in keeping a living organism alive."
      ],
      teks: ["B.6A", "B.5A", "B.6C"]
    }
  },
  {
    id: 9,
    fact: "A blue whale's heart is the size of a small car and beats only 8 times per minute.",
    learnMore: {
      title: "What does the largest heart in the world look like?",
      body: [
        "A blue whale's heart weighs around 400 pounds and is roughly the size of a golf cart. Its aorta, the main artery leaving the heart, is wide enough that a human could crawl through it. When a blue whale dives, its heart rate drops to as low as 2 beats per minute to conserve oxygen, then surges back up when it surfaces. This dramatic heart rate shift is the largest range ever recorded in any animal.",
        "Blue whales are the largest animals ever known to have existed on Earth, larger than any dinosaur. Their size is only possible because of the ocean: water supports their body weight in a way air cannot. Texas has no blue whale sightings, but the Gulf of Mexico is home to sperm whales and several dolphin species, all of which share the same diving adaptations on a smaller scale."
      ],
      teks: ["B.5A", "B.9C", "B.4B"]
    }
  },
  {
    id: 10,
    fact: "The Texas horned lizard can shoot blood from its eyes as a defense mechanism. The blood contains chemicals that smell repulsive to predators.",
    learnMore: {
      title: "How does a lizard shoot blood from its eyes?",
      body: [
        "The Texas horned lizard restricts blood flow leaving its head, causing pressure to build up in the sinus cavities around its eyes until the vessels burst and blood squirts out up to 5 feet. The blood is laced with chemicals from the lizard's diet of harvester ants that are toxic and foul-smelling to canine and feline predators like coyotes and mountain lions. It does not affect birds of prey, which are a bigger threat.",
        "The Texas horned lizard is the official state reptile of Texas and was once extremely common across the state. Populations have declined sharply due to habitat loss, the spread of fire ants replacing harvester ants, and pesticide use. Their story is a direct example of how changes in one part of an ecosystem ripple outward. Remove the harvester ant and you remove the lizard's food source, its chemical defense, and eventually the lizard itself."
      ],
      teks: ["B.9C", "B.4A", "B.4B"]
    }
  },
  {
    id: 11,
    fact: "Trees in a forest share nutrients with each other through underground fungal networks connecting their roots.",
    learnMore: {
      title: "How do trees talk to each other underground?",
      body: [
        "Mycorrhizal fungi form a network by attaching to tree roots and extending thread-like structures called hyphae through the soil. Through this network, trees exchange sugars, water, phosphorus, and nitrogen. Larger, older trees sometimes called mother trees have been shown to send extra carbon to younger seedlings growing in their shade, essentially subsidizing their growth.",
        "This challenges the idea that ecosystems are purely competitive. Many species cooperate in ways that benefit the group even at some cost to the individual. The fungal network also transmits chemical distress signals when one tree is attacked by insects, allowing neighboring trees to ramp up their own defenses before they are hit. East Texas pine forests and the oak woodlands of the Hill Country both host these underground networks."
      ],
      teks: ["B.4A", "B.4B", "B.5A"]
    }
  },
  {
    id: 12,
    fact: "Your brain uses about 20% of your body's total energy even though it makes up only 2% of your body weight.",
    learnMore: {
      title: "Why does your brain need so much energy?",
      body: [
        "Your brain never fully powers down. Even while you sleep it is consolidating memories, regulating hormones, and running the background processes that keep your body functioning. The cells responsible for most of this energy use are neurons, which maintain electrical gradients across their membranes constantly. Every time a neuron fires a signal it has to pump ions back into place, which costs energy. With roughly 86 billion neurons doing this continuously, the demand adds up fast.",
        "The brain's primary fuel is glucose. It cannot store much of it, which is why blood sugar crashes affect thinking and concentration so quickly. This is also why the brain has a dedicated blood supply system and why strokes, which cut off blood flow to brain tissue, cause damage within minutes. No other organ is as immediately dependent on a continuous energy supply."
      ],
      teks: ["B.5A", "B.12A", "B.11A"]
    }
  },
  {
    id: 13,
    fact: "A single strand of human hair is wide enough to fit about 1,000 ribosomes side by side.",
    learnMore: {
      title: "What do ribosomes actually do?",
      body: [
        "Ribosomes are the molecular machines that build every protein in your body. They read the instructions carried by messenger RNA and link amino acids together in the correct sequence to form a protein. A single cell can contain millions of ribosomes, some floating free in the cytoplasm and some attached to the endoplasmic reticulum, and they work continuously, producing thousands of proteins every second.",
        "Despite being so small that a thousand of them fit across a hair's width, ribosomes are structurally complex. They are made of two subunits, each built from ribosomal RNA and proteins. This structure is ancient. Ribosomes in bacteria, plants, animals, and fungi are all similar enough that scientists believe they evolved from a common ancestor billions of years ago. Many antibiotics work by targeting bacterial ribosomes specifically, disrupting protein production without harming human cells."
      ],
      teks: ["B.7B", "B.5A", "B.5B"]
    }
  },
  {
    id: 14,
    fact: "The pistol shrimp found in the Gulf of Mexico snaps its claw so fast it creates a flash of light and a shockwave that stuns its prey.",
    learnMore: {
      title: "How does a shrimp create a flash of light with its claw?",
      body: [
        "When a pistol shrimp snaps its specialized claw shut, it moves so fast that it creates a cavitation bubble, a tiny pocket of near-vacuum in the water. When that bubble collapses it generates a shockwave, a sound louder than a gunshot, temperatures briefly as hot as the surface of the sun, and a flash of light. The whole event lasts less than a millisecond. The shockwave stuns or kills small prey animals nearby.",
        "This phenomenon, called sonoluminescence, is one of the stranger intersections of biology and physics. Pistol shrimp are common in the shallow Gulf Coast waters off Texas and they are one of the loudest animals in the ocean. Large colonies of them create a constant crackling sound that can interfere with sonar equipment. Their claw is a perfect example of how evolution can produce structures that exploit physical laws in ways that seem almost impossible for a living thing."
      ],
      teks: ["B.9C", "B.4B", "B.2A"]
    }
  },
  {
    id: 15,
    fact: "Dolphins sleep with one half of their brain at a time so the other half can keep them breathing.",
    learnMore: {
      title: "How do dolphins sleep without drowning?",
      body: [
        "Dolphins are conscious breathers, meaning they have to actively decide to come up for air. They cannot go fully unconscious the way humans do during sleep or they would stop breathing and sink. Their solution is unihemispheric slow-wave sleep, where one hemisphere of the brain enters a sleep state while the other stays awake and alert. They switch sides periodically throughout the rest period.",
        "During this half-sleep, dolphins can still swim slowly, monitor their surroundings, and surface to breathe. Bottlenose dolphins, which are common along the Texas Gulf Coast, have been observed logging at the surface during these rest periods, floating quietly with one eye open and one eye closed. This adaptation is also seen in some birds, which can sleep while flying by resting one hemisphere at a time, showing that evolution arrived at the same solution in very different animals."
      ],
      teks: ["B.9C", "B.12A", "B.5A"]
    }
  },
  {
    id: 16,
    fact: "The cells lining your stomach are replaced every 3 to 5 days because stomach acid would otherwise digest them.",
    learnMore: {
      title: "Why does your stomach not digest itself?",
      body: [
        "Stomach acid is hydrochloric acid strong enough to dissolve metal. The cells lining the stomach survive by producing a thick layer of mucus that forms a protective barrier between the acid and the cell surface. Even so, the acid and digestive enzymes do wear the cells down, which is why the entire stomach lining is replaced every few days through rapid cell division.",
        "When this protection fails, the acid reaches the stomach wall directly and begins breaking it down, causing a peptic ulcer. For a long time doctors believed ulcers were caused entirely by stress and diet. In the 1980s two Australian scientists discovered that most ulcers are actually caused by a bacterium called Helicobacter pylori that burrows into the mucus lining and disrupts it. This discovery changed treatment entirely and eventually earned a Nobel Prize, a reminder that even well-established medical beliefs can be overturned by careful observation."
      ],
      teks: ["B.5A", "B.6A", "B.9C"]
    }
  },
  {
    id: 17,
    fact: "A single human egg cell is the largest cell in the human body and is just barely visible to the naked eye.",
    learnMore: {
      title: "Why is the egg cell so large?",
      body: [
        "Most human cells are far too small to see without a microscope. The egg cell is the exception. At about 0.1 millimeters across it sits right at the edge of human vision, roughly the width of a strand of fine silk. Its size comes from what it has to carry: a full set of genetic material, mitochondria to power early development, and enough nutrients and cellular machinery to sustain a fertilized egg through its first several days before it can access nutrients from the uterus.",
        "Sperm cells are the opposite extreme, among the smallest cells in the human body, stripped down to almost nothing but a nucleus and a tail. The contrast between egg and sperm is one of the starkest examples of how two cell types shaped by the same evolutionary process can end up radically different based on the specific job they need to do. The egg cell invests everything in quality and preparation. The sperm invests in quantity and speed."
      ],
      teks: ["B.8A", "B.5A", "B.6A"]
    }
  },
  {
    id: 18,
    fact: "Coral reefs off the Texas coast are alive. Each coral is actually a colony of thousands of tiny animals called polyps.",
    learnMore: {
      title: "What is coral, exactly?",
      body: [
        "Coral looks like rock or colorful plant matter but it is neither. Each piece of coral is a colony of genetically identical animals called polyps, each one a tiny tube with a mouth surrounded by tentacles. Polyps build hard calcium carbonate skeletons around themselves and live in those structures, filtering food from the water and hosting photosynthetic algae called zooxanthellae inside their tissues. The algae provide the coral with up to 90% of its energy through photosynthesis.",
        "The Flower Garden Banks, located about 100 miles off the Texas Gulf Coast, are the northernmost coral reef system in the continental United States. They sit in deep enough water to have avoided much of the coastal runoff and temperature stress that has damaged shallower reefs, making them among the healthiest coral ecosystems in the Caribbean region. When water temperatures rise too much, corals expel their algae in a process called bleaching, which cuts off their energy supply and can kill the colony if conditions do not improve."
      ],
      teks: ["B.4A", "B.4B", "B.11A"]
    }
  },
  {
    id: 19,
    fact: "Bacteria have been found living in the clouds above Texas, carried thousands of feet into the atmosphere by wind.",
    learnMore: {
      title: "How do bacteria end up in clouds?",
      body: [
        "Bacteria from soil, plants, and water surfaces get swept into the atmosphere by wind, particularly during dust storms, wildfires, and strong updrafts. Once airborne they can travel thousands of miles. Some species have been found in cloud droplets and ice crystals at altitudes of 30,000 feet. Certain bacteria can even act as ice nuclei, triggering ice crystal formation in clouds and potentially influencing precipitation.",
        "Texas is a particularly active source of airborne bacteria due to its large agricultural areas, frequent dust events in West Texas, and Gulf Coast humidity that supports dense microbial populations near the surface. This discovery expanded the definition of the biosphere, the zone of Earth where life exists, far beyond what scientists previously thought. Life does not just exist where conditions are comfortable. It turns up almost everywhere conditions allow even minimal survival."
      ],
      teks: ["B.4B", "B.4A", "B.2A"]
    }
  },
  {
    id: 20,
    fact: "Your bones are constantly being broken down and rebuilt. Every 10 years you have an almost entirely new skeleton.",
    learnMore: {
      title: "How does bone renew itself?",
      body: [
        "Bone looks static but it is living tissue in constant motion. Two types of cells manage this process. Osteoclasts break down old or damaged bone tissue, dissolving the mineral matrix and releasing calcium into the bloodstream. Osteoblasts follow behind, laying down new bone tissue and mineralizing it. This cycle of resorption and formation is called bone remodeling and it happens continuously throughout your life.",
        "This process serves two purposes. First it repairs microscopic damage from daily stress before it can accumulate into fractures. Second it regulates calcium levels in the blood, which is critical for muscle contraction, nerve signaling, and dozens of other functions. When the balance tips, problems follow. Osteoporosis happens when osteoclasts break bone down faster than osteoblasts can rebuild it. Exercise, particularly weight-bearing activity, signals osteoblasts to build denser bone, which is why physical activity in adolescence has lifelong effects on skeletal strength."
      ],
      teks: ["B.5A", "B.6A", "B.12A"]
    }
  },
  {
    id: 21,
    fact: "The immortal jellyfish can revert its cells back to an earlier state when stressed, essentially restarting its life cycle.",
    learnMore: {
      title: "Can something actually be biologically immortal?",
      body: [
        "Turritopsis dohrnii, a jellyfish about the size of a pinky fingernail, can respond to physical damage, starvation, or old age by reverting its mature cells back to an earlier developmental state, a process called transdifferentiation. The adult jellyfish essentially transforms back into a polyp, the juvenile form, and begins its life cycle again. In theory this process can repeat indefinitely, which is why it earned the nickname the immortal jellyfish.",
        "In practice immortality is complicated. The jellyfish can still be eaten, killed by disease, or damaged beyond recovery. But the cellular mechanism itself is genuinely remarkable because it runs in reverse of normal development. In most animals cells become more specialized over time and cannot go backward. Understanding how this jellyfish resets its cellular identity is an active area of research with potential implications for aging science and regenerative medicine. It is a reminder that biology finds solutions that seem to break the rules."
      ],
      teks: ["B.6A", "B.5A", "B.9C"]
    }
  },
  {
    id: 22,
    fact: "A single acre of Texas prairie grass can hold millions of root connections stretching deeper than the grass is tall.",
    learnMore: {
      title: "Why do prairie plants invest so much in roots?",
      body: [
        "Texas blackland prairie grasses like little bluestem and sideoats grama allocate most of their energy below ground. Some species have root systems extending 10 to 15 feet deep, far deeper than their above-ground stems are tall. This is a direct adaptation to the Texas climate: surface soil dries out fast, but deep roots can reach water and nutrients that survive drought conditions. It also makes prairie grasses extremely difficult to kill. You can burn them, graze them, or cut them and the root system survives and regenerates.",
        "Those deep root networks are also critical for carbon storage. Prairie soils hold more carbon per acre than many forests because the root mass decays slowly underground and builds up organic matter over centuries. The destruction of native Texas prairie, most of which has been converted to farmland or development, released enormous amounts of stored carbon and eliminated one of the most productive ecosystems on the continent. Less than 1% of original Texas blackland prairie remains intact today."
      ],
      teks: ["B.4A", "B.4B", "B.9C", "B.11A"]
    }
  },
  {
    id: 23,
    fact: "Photosynthesis produces every oxygen molecule you have ever breathed. Every single one came from a plant or algae.",
    learnMore: {
      title: "Where does the oxygen in air actually come from?",
      body: [
        "Oxygen is a byproduct of photosynthesis. When plants, algae, and cyanobacteria split water molecules using light energy, they release oxygen as a waste product. This has been happening for about 2.7 billion years. Before photosynthetic organisms evolved, Earth's atmosphere contained almost no free oxygen. The accumulation of photosynthetic oxygen over billions of years, an event called the Great Oxidation Event, permanently transformed the planet and made complex animal life possible.",
        "Today roughly half of Earth's oxygen is produced by phytoplankton in the ocean, microscopic algae floating near the surface. The other half comes from land plants. The Amazon rainforest, often called the lungs of the Earth, is actually carbon-neutral in terms of oxygen because it consumes as much oxygen through decomposition as it produces. The real oxygen surplus comes from ecosystems where organic matter gets buried before it fully decomposes, locking the carbon away and leaving the oxygen behind."
      ],
      teks: ["B.11A", "B.4A", "B.4B"]
    }
  },
  {
    id: 24,
    fact: "Your pupils dilate when you see something you find interesting, even before you are aware you care about it.",
    learnMore: {
      title: "Why do your pupils change size based on what you are thinking?",
      body: [
        "Pupil dilation is controlled by the autonomic nervous system, the part of the nervous system that operates below conscious awareness. The brain processes visual information and emotional salience before it reaches conscious perception, and if something registers as interesting, novel, or emotionally significant, signals go out to dilate the pupils to let in more light and improve visual detail. This happens faster than you can notice it consciously.",
        "Researchers have used pupil dilation as a window into unconscious cognitive processing for decades. It increases with mental effort, emotional arousal, and genuine interest in a stimulus. Advertisers, psychologists, and neuroscientists all study it. The fact that your body responds to your environment before your conscious mind catches up is a reminder that most of what your brain does never reaches awareness at all. Conscious thought is a small fraction of the brain's total activity."
      ],
      teks: ["B.12A", "B.5A", "B.9C"]
    }
  },
  {
    id: 25,
    fact: "The axolotl, a salamander native to Mexico, can regrow lost limbs, parts of its heart, and portions of its brain.",
    learnMore: {
      title: "How does an axolotl regrow an entire limb?",
      body: [
        "When an axolotl loses a limb, the cells near the wound do something almost no other vertebrate cells can do: they dedifferentiate, meaning they reverse their specialized state and become a mass of stem-like cells called a blastema. The blastema then proliferates and redifferentiates into all the specific cell types needed to rebuild the limb, including bone, muscle, nerves, and skin, in the correct positions and proportions. The process takes weeks and produces a fully functional replacement.",
        "Axolotls are native to lake systems near Mexico City and are critically endangered in the wild due to habitat destruction and invasive species. They are widely used in laboratory research because their regenerative abilities offer clues about what might be possible in human medicine. Human cells retain some of the same genetic machinery used in axolotl regeneration but it is largely switched off. Understanding what keeps it active in axolotls and silent in humans is one of the more exciting open questions in cell biology."
      ],
      teks: ["B.6A", "B.5A", "B.7A"]
    }
  },
  {
    id: 26,
    fact: "Hummingbirds found along the Texas Gulf Coast can fly nonstop across the Gulf of Mexico, about 500 miles, without landing.",
    learnMore: {
      title: "How does something that weighs less than a nickel fly 500 miles nonstop?",
      body: [
        "Ruby-throated hummingbirds weigh about 3 grams, less than a nickel, and their wings beat 50 times per second. Before making the Gulf crossing each fall they spend weeks feeding heavily and nearly double their body weight in fat, which becomes their fuel for the flight. The crossing takes around 18 to 22 hours of continuous flight over open water with no opportunity to rest, feed, or drink.",
        "This migration is one of the most energy-demanding feats relative to body size in the animal kingdom. The birds use favorable wind conditions and time their departures to take advantage of cold fronts moving through Texas in the fall. The Texas Gulf Coast, particularly areas like High Island and the Bolivar Peninsula, becomes a critical stopover habitat where exhausted hummingbirds that have just completed the northward crossing in spring land and immediately begin feeding. Habitat on the Texas coast is essential for their survival."
      ],
      teks: ["B.9C", "B.4B", "B.12A"]
    }
  },
  {
    id: 27,
    fact: "A wolf spider mother carries her egg sac attached to her body and then lets her newly hatched spiderlings ride on her back.",
    learnMore: {
      title: "Why does a wolf spider carry her young?",
      body: [
        "Wolf spiders do not build webs to catch prey. They hunt actively, chasing down insects on the ground, which means they are mobile and exposed. Rather than leaving eggs in a fixed nest where they would be vulnerable, the female attaches the egg sac to her spinnerets and carries it with her everywhere she goes. After the spiderlings hatch they climb onto her abdomen and ride there for about a week until they are large enough to survive independently.",
        "If the egg sac is removed experimentally, the mother will search for it and reattach it, even if it is replaced with a cotton ball of similar size and weight. This behavior is instinctive rather than learned. Wolf spiders are one of the most common spiders in Texas and play a significant role in controlling insect populations in grasslands, gardens, and agricultural fields. They are harmless to humans and are considered beneficial in most ecosystems they inhabit."
      ],
      teks: ["B.9C", "B.4A", "B.7C"]
    }
  },
  {
    id: 28,
    fact: "The electric eel can produce a charge strong enough to stun a horse. It uses this same charge to sense its surroundings in murky water.",
    learnMore: {
      title: "How does an animal generate electricity?",
      body: [
        "Electric eels are not actually eels but a type of knifefish native to South American rivers. About 80% of their body is made up of specialized cells called electrocytes, stacked in columns like batteries in series. Each electrocyte generates a small voltage by pumping ions across its membrane. When thousands fire simultaneously the voltages add up, producing discharges of up to 860 volts, enough to stun large animals or cause a human to lose muscle control and drown.",
        "They use lower-voltage pulses continuously to navigate and detect objects in the dark, muddy waters where they live, a process called electrolocation. High-voltage discharges are reserved for hunting and defense. Recent research found that electric eels can also use their discharge to remotely control the muscles of prey, causing involuntary twitching that reveals hidden fish. This is one of the more recently discovered predatory behaviors in any vertebrate and it was found in an animal scientists thought they understood well."
      ],
      teks: ["B.5A", "B.9C", "B.12A"]
    }
  },
  {
    id: 29,
    fact: "Your immune system produces about 10 million new white blood cells every hour, constantly scanning for anything that does not belong.",
    learnMore: {
      title: "How does your immune system know what to attack?",
      body: [
        "White blood cells come in several types, each with a different role. Neutrophils patrol the bloodstream and engulf bacteria and debris. T cells learn to recognize specific threats and coordinate targeted responses. B cells produce antibodies, proteins that bind to specific pathogens and mark them for destruction. Natural killer cells destroy infected or cancerous cells. All of them are produced in bone marrow and released into circulation continuously.",
        "What makes the immune system remarkable is its ability to distinguish between self and non-self. Every cell in your body displays proteins on its surface that identify it as belonging to you. Immune cells learn to ignore these markers during development. When they encounter a cell or organism displaying unfamiliar proteins they mount a response. When this system malfunctions and attacks the body's own tissues the result is autoimmune disease. When it fails to recognize cancer cells as threats, tumors can grow unchecked. The precision of this recognition system, developed over hundreds of millions of years of evolution, has no equivalent in any technology humans have built."
      ],
      teks: ["B.5A", "B.6A", "B.12A"]
    }
  },
  {
    id: 30,
    fact: "Mycorrhizal fungi connect the roots of plants across an entire forest. When one tree is sick, neighboring trees can send it sugar through the network.",
    learnMore: {
      title: "How does a forest function as a single connected system?",
      body: [
        "Mycorrhizal fungi form partnerships with the roots of about 90% of all land plant species. The fungi receive sugars from the plant in exchange for dramatically expanding the plant's ability to absorb water and nutrients, particularly phosphorus, from the soil. The fungal threads called hyphae extend far beyond where roots could reach on their own, effectively multiplying the plant's surface area hundreds of times over.",
        "Because the same fungal network connects multiple plants, resources can move between them. Studies in Douglas fir forests showed that large old trees transferred significant amounts of carbon to smaller trees of the same species growing nearby, particularly their own offspring. The network also transmits chemical signals when plants are under stress from drought, disease, or insect attack, triggering defensive responses in connected neighbors before they are directly affected. This does not mean forests think or feel, but it does mean that what looks like a collection of individual trees is actually functioning as an interconnected system in ways that matter for the health of the whole."
      ],
      teks: ["B.4A", "B.4B", "B.11A"]
    }
  }
];
