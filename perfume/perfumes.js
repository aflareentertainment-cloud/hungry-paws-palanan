// Perfume catalog data. To add a perfume, copy one entry and edit it.
// category: "luxury" | "niche" | "arabian"
// color / cap: bottle illustration colours. photo: optional path to your own product photo.
window.PERFUMES = [
  // ---------- LUXURY / DESIGNER ----------
  {
    id: "dior-sauvage", category: "luxury",
    brand: "Dior", name: "Sauvage", type: "Eau de Toilette", gender: "Men",
    year: 2015, perfumer: "François Demachy",
    color: "#2c4a7a", cap: "#1b1b1b",
    blurb: "Peppery citrus over a big, smooth ambroxan trail. Fresh, loud and easy to like.",
    accords: ["Fresh spicy", "Citrus", "Aromatic", "Amber", "Woody"],
    notes: {
      top: ["Bergamot", "Pepper"],
      heart: ["Sichuan Pepper", "Lavender", "Pink Pepper", "Geranium", "Vetiver", "Patchouli", "Elemi"],
      base: ["Ambroxan", "Cedar", "Labdanum"]
    },
    bestFor: "Daily wear, all year"
  },
  {
    id: "bleu-de-chanel", category: "luxury",
    brand: "Chanel", name: "Bleu de Chanel", type: "Eau de Parfum", gender: "Men",
    year: 2014, perfumer: "Jacques Polge",
    color: "#1c2a44", cap: "#0e0e0e",
    blurb: "Clean citrus and incense on a polished woody base. The office-to-dinner classic.",
    accords: ["Citrus", "Woody", "Aromatic", "Amber", "Fresh spicy"],
    notes: {
      top: ["Grapefruit", "Lemon", "Mint", "Pink Pepper", "Bergamot"],
      heart: ["Ginger", "Nutmeg", "Jasmine"],
      base: ["Incense", "Cedar", "Sandalwood", "Patchouli", "Labdanum", "Amber"]
    },
    bestFor: "Office, dinner, all year"
  },
  {
    id: "ysl-libre", category: "luxury",
    brand: "Yves Saint Laurent", name: "Libre", type: "Eau de Parfum", gender: "Women",
    year: 2019, perfumer: "Anne Flipo & Carlos Benaïm",
    color: "#c9a25a", cap: "#111111",
    blurb: "Lavender meets orange blossom and vanilla. Bold, warm and feminine with an edge.",
    accords: ["Floral", "Aromatic", "Vanilla", "White floral", "Citrus"],
    notes: {
      top: ["Lavender", "Mandarin", "Black Currant", "Petitgrain"],
      heart: ["Lavender", "Orange Blossom", "Jasmine"],
      base: ["Vanilla", "Musk", "Cedar", "Ambergris"]
    },
    bestFor: "Evening, cooler months"
  },
  {
    id: "la-vie-est-belle", category: "luxury",
    brand: "Lancôme", name: "La Vie Est Belle", type: "Eau de Parfum", gender: "Women",
    year: 2012, perfumer: "Olivier Polge, Dominique Ropion & Anne Flipo",
    color: "#e7b8c2", cap: "#d9c7a6",
    blurb: "Iris and praline wrapped in vanilla. Sweet, cosy and instantly recognisable.",
    accords: ["Sweet", "Gourmand", "Vanilla", "Powdery", "Fruity"],
    notes: {
      top: ["Black Currant", "Pear"],
      heart: ["Iris", "Jasmine", "Orange Blossom"],
      base: ["Praline", "Vanilla", "Patchouli", "Tonka Bean"]
    },
    bestFor: "Date night, cool weather"
  },

  // ---------- NICHE ----------
  {
    id: "lheure-verte", category: "niche",
    brand: "Kilian Paris", name: "L'Heure Verte", type: "Eau de Parfum", gender: "Unisex",
    perfumer: "Mathieu Nardin",
    color: "#4f7a3a", cap: "#1a1a1a",
    blurb: "The Paris “green hour” in a bottle. Bitter absinthe, cool violet leaf, then dark patchouli and woods.",
    accords: ["Green", "Aromatic", "Boozy", "Earthy", "Woody"],
    notes: {
      top: ["Absinthe"],
      heart: ["Violet Leaf"],
      base: ["Patchouli", "Vetiver", "Sandalwood"]
    },
    bestFor: "Evening, fall and winter"
  },
  {
    id: "baccarat-rouge-540", category: "niche",
    brand: "Maison Francis Kurkdjian", name: "Baccarat Rouge 540", type: "Eau de Parfum", gender: "Unisex",
    year: 2015, perfumer: "Francis Kurkdjian",
    color: "#c2453a", cap: "#c9a85a",
    blurb: "Airy saffron and jasmine on a glowing amber-wood base. The modern luxury trail.",
    accords: ["Amber", "Woody", "Warm spicy", "Sweet", "Mineral"],
    notes: {
      top: ["Saffron", "Jasmine"],
      heart: ["Amberwood", "Ambergris"],
      base: ["Fir Resin", "Cedar"]
    },
    bestFor: "Special occasions, all year"
  },
  {
    id: "santal-33", category: "niche",
    brand: "Le Labo", name: "Santal 33", type: "Eau de Parfum", gender: "Unisex",
    year: 2011, perfumer: "Frank Voelkl",
    color: "#cdbb98", cap: "#2a2a2a",
    blurb: "Creamy sandalwood with leather and violet. Dry, smoky and cult-favourite.",
    accords: ["Woody", "Leather", "Powdery", "Warm spicy", "Smoky"],
    notes: {
      top: ["Cardamom", "Violet"],
      heart: ["Iris", "Ambrox"],
      base: ["Sandalwood", "Papyrus", "Cedar", "Leather"]
    },
    bestFor: "Daily signature, all year"
  },
  {
    id: "creed-aventus", category: "niche",
    brand: "Creed", name: "Aventus", type: "Eau de Parfum", gender: "Men",
    year: 2010, perfumer: "Olivier Creed & Erwin Creed",
    color: "#1f1f1f", cap: "#c0c0c0",
    blurb: "Smoky pineapple and birch over musk and oakmoss. Confident, fruity and powerful.",
    accords: ["Fruity", "Smoky", "Woody", "Musky", "Fresh"],
    notes: {
      top: ["Pineapple", "Bergamot", "Black Currant", "Apple"],
      heart: ["Birch", "Patchouli", "Jasmine", "Rose"],
      base: ["Musk", "Oakmoss", "Ambergris", "Vanilla"]
    },
    bestFor: "Day, spring and summer"
  },

  // ---------- ARABIAN ----------
  {
    id: "lattafa-khamrah", category: "arabian",
    brand: "Lattafa", name: "Khamrah", type: "Eau de Parfum", gender: "Unisex",
    year: 2022,
    color: "#7a2e1f", cap: "#c9a85a",
    blurb: "Spiced dates and praline in warm vanilla. Rich, sweet and great value.",
    accords: ["Warm spicy", "Sweet", "Gourmand", "Amber", "Vanilla"],
    notes: {
      top: ["Cinnamon", "Nutmeg", "Bergamot"],
      heart: ["Dates", "Praline", "Tuberose"],
      base: ["Vanilla", "Tonka Bean", "Amberwood", "Myrrh", "Benzoin"]
    },
    bestFor: "Night, cold weather"
  },
  {
    id: "lattafa-asad", category: "arabian",
    brand: "Lattafa", name: "Asad", type: "Eau de Parfum", gender: "Men",
    year: 2021,
    color: "#1a1a1a", cap: "#c9a85a",
    blurb: "Black pepper, coffee and tobacco over vanilla and amber. Dark and bold.",
    accords: ["Warm spicy", "Amber", "Vanilla", "Woody", "Coffee"],
    notes: {
      top: ["Black Pepper", "Pineapple", "Tobacco"],
      heart: ["Coffee", "Patchouli", "Iris"],
      base: ["Vanilla", "Amber", "Benzoin", "Labdanum"]
    },
    bestFor: "Evening, fall and winter"
  },
  {
    id: "cdn-intense-man", category: "arabian",
    brand: "Armaf", name: "Club de Nuit Intense Man", type: "Eau de Toilette", gender: "Men",
    year: 2015,
    color: "#151515", cap: "#a8a8a8",
    blurb: "Lemon, pineapple and smoky birch on a musky base. A fan-favourite powerhouse.",
    accords: ["Citrus", "Fruity", "Smoky", "Woody", "Musky"],
    notes: {
      top: ["Lemon", "Pineapple", "Bergamot", "Black Currant", "Apple"],
      heart: ["Birch", "Jasmine", "Rose"],
      base: ["Musk", "Ambergris", "Patchouli", "Vanilla"]
    },
    bestFor: "Day and night, all year"
  },
  {
    id: "amouage-interlude-man", category: "arabian",
    brand: "Amouage", name: "Interlude Man", type: "Eau de Parfum", gender: "Men",
    year: 2012, perfumer: "Pierre Negrin",
    color: "#2b3b5a", cap: "#c9a85a",
    blurb: "Oregano and pepper into thick incense, oud and leather. Smoky Omani luxury.",
    accords: ["Smoky", "Resinous", "Amber", "Leather", "Oud"],
    notes: {
      top: ["Oregano", "Pepper", "Bergamot"],
      heart: ["Incense", "Amber", "Opoponax"],
      base: ["Leather", "Oud", "Sandalwood", "Patchouli"]
    },
    bestFor: "Night, cold weather"
  }
];

window.CATEGORIES = [
  { id: "all", label: "All" },
  { id: "luxury", label: "Luxury", desc: "Designer houses: Dior, Chanel, YSL, Lancôme" },
  { id: "niche", label: "Niche", desc: "Independent and artistic perfume houses" },
  { id: "arabian", label: "Arabian", desc: "Middle Eastern houses: oud, amber, spice and sweetness" }
];
