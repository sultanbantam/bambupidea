export const bambooSpecies = {
  "INDONESIA": [
    { common: "Bambu Ampel", scientific: "Bambusa vulgaris", region: "Indonesia" },
    { common: "Bambu Andong", scientific: "Gigantochloa verticillata", region: "Indonesia" },
    { common: "Bambu Apus / Tali", scientific: "Gigantochloa apus", region: "Indonesia" },
    { common: "Bambu Ater / Legi", scientific: "Gigantochloa atter", region: "Indonesia" },
    { common: "Bambu Cendani", scientific: "Schizostachyum brachycladum", region: "Indonesia" },
    { common: "Bambu Duri", scientific: "Bambusa bambos", region: "Indonesia" },
    { common: "Bambu Gombong", scientific: "Gigantochloa pseudoarundinacea", region: "Indonesia" },
    { common: "Bambu Hitam", scientific: "Gigantochloa atroviolacea", region: "Indonesia" },
    { common: "Bambu Kuning", scientific: "Bambusa vulgaris var. vittata", region: "Indonesia" },
    { common: "Bambu Ori", scientific: "Bambusa blumeana", region: "Indonesia" },
    { common: "Bambu Petung", scientific: "Dendrocalamus asper", region: "Indonesia" },
    { common: "Bambu Tamiang", scientific: "Schizostachyum zollingeri", region: "Indonesia" },
    { common: "Bambu Tutul", scientific: "Bambusa maculata", region: "Indonesia" },
    { common: "Bambu Wulung", scientific: "Gigantochloa atroviolacea", region: "Indonesia" },
  ],
  "ASIA (GENERAL)": [
    { common: "Arrow Bamboo", scientific: "Pseudosasa japonica", region: "Japan" },
    { common: "Black Bamboo", scientific: "Phyllostachys nigra", region: "China" },
    { common: "Fargesia Bamboo", scientific: "Fargesia murielae", region: "China" },
    { common: "Golden Bamboo", scientific: "Phyllostachys aurea", region: "China/Japan" },
    { common: "Madake Bamboo", scientific: "Phyllostachys bambusoides", region: "Japan" },
    { common: "Moso Bamboo", scientific: "Phyllostachys edulis", region: "China" },
    { common: "Temple Bamboo", scientific: "Semiarundinaria fastuosa", region: "Japan" },
    { common: "Thorny Bamboo", scientific: "Bambusa bambos", region: "South Asia" },
    { common: "Umbrella Bamboo", scientific: "Fargesia robusta", region: "China" },
    { common: "Weaver's Bamboo", scientific: "Bambusa textilis", region: "Asia" },
  ],
  "INDIA": [
    { common: "Bambusa tulda", scientific: "Bambusa tulda", region: "India" },
    { common: "Male Bamboo", scientific: "Dendrocalamus strictus", region: "India" },
    { common: "Dendrocalamus hamiltonii", scientific: "Dendrocalamus hamiltonii", region: "India" },
    { common: "Indian Timber Bamboo", scientific: "Bambusa bambos", region: "India" },
    { common: "Melocanna baccifera", scientific: "Melocanna baccifera", region: "India" },
    { common: "Ochlandra travancorica", scientific: "Ochlandra travancorica", region: "India" },
  ],
  "AFRICA": [
    { common: "African Alpine Bamboo", scientific: "Yushania alpina", region: "Africa" },
    { common: "Oldeania alpina", scientific: "Oldeania alpina", region: "East Africa" },
    { common: "Savanna Bamboo", scientific: "Oxytenanthera abyssinica", region: "Africa" },
  ],
  "MIDDLE EAST": [
    { common: "Arundinaria species", scientific: "Arundinaria species", region: "Middle East (limited)" },
    { common: "Introduced Bambusa vulgaris", scientific: "Bambusa vulgaris", region: "Middle East" },
  ],
  "EUROPE (Introduced)": [
    { common: "Fargesia rufa", scientific: "Fargesia rufa", region: "Europe" },
    { common: "Phyllostachys aureosulcata", scientific: "Phyllostachys aureosulcata", region: "Europe" },
    { common: "Phyllostachys bissetii", scientific: "Phyllostachys bissetii", region: "Europe" },
    { common: "Pleioblastus variegatus", scientific: "Pleioblastus variegatus", region: "Europe" },
  ],
  "AMERICA": [
    { common: "Chusquea culeou", scientific: "Chusquea culeou", region: "Chile" },
    { common: "Chusquea gigantea", scientific: "Chusquea gigantea", region: "South America" },
    { common: "Guadua amplexifolia", scientific: "Guadua amplexifolia", region: "Central America" },
    { common: "Guadua Bamboo", scientific: "Guadua angustifolia", region: "South America" },
    { common: "Mexican Bamboo", scientific: "Otatea acuminata", region: "Mexico" },
    { common: "River Cane", scientific: "Arundinaria gigantea", region: "USA" },
  ],
  "AUSTRALIA": [
    { common: "Bambusa arnhemica", scientific: "Bambusa arnhemica", region: "Australia" },
    { common: "Introduced Bambusa vulgaris", scientific: "Bambusa vulgaris", region: "Australia" },
    { common: "Neololeba atra", scientific: "Neololeba atra", region: "Northern Australia" },
  ],
  "GLOBAL / ECONOMIC SPECIES": [
    { common: "Bambusa oldhamii", scientific: "Bambusa oldhamii", region: "Global" },
    { common: "Bambusa vulgaris", scientific: "Bambusa vulgaris", region: "Global" },
    { common: "Giant Bamboo", scientific: "Dendrocalamus asper", region: "Global" },
    { common: "Giant Bamboo", scientific: "Dendrocalamus giganteus", region: "Global" },
    { common: "Guadua angustifolia", scientific: "Guadua angustifolia", region: "Global" },
    { common: "Moso Bamboo", scientific: "Phyllostachys edulis", region: "Global" },
  ]
};

// Sort alphabetically inside each group
Object.keys(bambooSpecies).forEach(key => {
  bambooSpecies[key].sort((a, b) => a.common.localeCompare(b.common));
});
