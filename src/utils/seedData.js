// src/utils/seedData.js
const mongoose = require('mongoose');
require('dotenv').config();
const Place = require('../../models/Place');

const sriLankaPlaces = [
  {
    name: "Sigiriya",
    description: "Ancient rock fortress and palace ruin with frescoes located in central Sri Lanka. Built by King Kashyapa, it's one of Sri Lanka's most iconic UNESCO World Heritage sites.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 7.9570,
        lng: 80.7603
      }
    },
    images: ["https://example.com/images/sigiriya1.jpg", "https://example.com/images/sigiriya2.jpg"],
    openingHours: {
      open: "7:00",
      close: "17:30"
    },
    contactInfo: {
      phone: "+94 66 2286 601",
      email: "info@sigiriya.lk"
    }
  },
  {
    name: "Unawatuna Beach",
    description: "A beautiful beach near Galle, famous for its golden sand, coral reefs, and swimming-friendly waters. Popular for snorkeling, diving, and beach activities.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 6.0100,
        lng: 80.2504
      }
    },
    images: ["https://example.com/images/unawatuna1.jpg", "https://example.com/images/unawatuna2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 91 2224 324",
      email: "tourism@unawatuna.lk"
    }
  },
  {
    name: "Temple of the Sacred Tooth Relic",
    description: "Located in Kandy, this Buddhist temple houses the relic of the tooth of the Buddha and is a major pilgrimage site. The temple complex is part of the royal palace.",
    category: "Religious",
    location: {
      coordinates: {
        lat: 7.2936,
        lng: 80.6413
      }
    },
    images: ["https://example.com/images/tooth-temple1.jpg", "https://example.com/images/tooth-temple2.jpg"],
    openingHours: {
      open: "6:00",
      close: "20:00"
    },
    contactInfo: {
      phone: "+94 81 2234 226",
      email: "info@daladamaligawa.org"
    }
  },
  {
    name: "Ella Rock",
    description: "A famous hiking spot offering panoramic views of the surrounding hills and valleys. The hike takes about 4 hours round trip from Ella town.",
    category: "Adventure",
    location: {
      coordinates: {
        lat: 6.8667,
        lng: 81.0466
      }
    },
    images: ["https://example.com/images/ella-rock1.jpg", "https://example.com/images/ella-rock2.jpg"],
    openingHours: {
      open: "5:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 57 2228 739",
      email: "tourism@ella.lk"
    }
  },
  {
    name: "Yala National Park",
    description: "One of Sri Lanka's largest wildlife sanctuaries, famous for its high leopard density. The park features various ecosystems and abundant wildlife including elephants, crocodiles, and numerous bird species.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 6.3735,
        lng: 81.5089
      }
    },
    images: ["https://example.com/images/yala1.jpg", "https://example.com/images/yala2.jpg"],
    openingHours: {
      open: "6:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 47 2220 076",
      email: "info@yalanationalpark.lk"
    }
  },
  {
    name: "Galle Fort",
    description: "A UNESCO World Heritage site built by the Portuguese and later fortified by the Dutch in the 16th century. Features colonial architecture, narrow streets, and ocean views.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 6.0257,
        lng: 80.2167
      }
    },
    images: ["https://example.com/images/galle-fort1.jpg", "https://example.com/images/galle-fort2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 91 2223 065",
      email: "tourism@galle.lk"
    }
  },
  {
    name: "Adam's Peak",
    description: "A conical mountain with religious significance to multiple faiths. Known for its distinctive 'sacred footprint' and stunning sunrise views after climbing the 5,500 steps.",
    category: "Religious",
    location: {
      coordinates: {
        lat: 6.8096,
        lng: 80.4994
      }
    },
    images: ["https://example.com/images/adams-peak1.jpg", "https://example.com/images/adams-peak2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 52 2222 797",
      email: "info@sripada.lk"
    }
  },
  // New additions below
  {
    name: "Mirissa Beach",
    description: "A stunning crescent-shaped beach famous for whale watching, surfing, and laid-back atmosphere. Visitors can enjoy golden sands, turquoise waters, and magnificent sunsets.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 5.9483,
        lng: 80.4589
      }
    },
    images: ["https://example.com/images/mirissa1.jpg", "https://example.com/images/mirissa2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 41 2250 200",
      email: "info@mirissabeach.lk"
    }
  },
  {
    name: "Polonnaruwa Ancient City",
    description: "The second most ancient kingdom of Sri Lanka featuring well-preserved ruins of ancient structures, palaces, and monuments. The UNESCO World Heritage site includes the famous Gal Vihara statues.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 7.9403,
        lng: 81.0188
      }
    },
    images: ["https://example.com/images/polonnaruwa1.jpg", "https://example.com/images/polonnaruwa2.jpg"],
    openingHours: {
      open: "7:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 27 2222 255",
      email: "archaeology@polonnaruwa.lk"
    }
  },
  {
    name: "Dambulla Cave Temple",
    description: "A UNESCO World Heritage site featuring five caves with over 150 Buddha statues and paintings dating back to the 1st century BC. It is the largest and best-preserved cave temple complex in Sri Lanka.",
    category: "Religious",
    location: {
      coordinates: {
        lat: 7.8675,
        lng: 80.6514
      }
    },
    images: ["https://example.com/images/dambulla1.jpg", "https://example.com/images/dambulla2.jpg"],
    openingHours: {
      open: "7:00",
      close: "19:00"
    },
    contactInfo: {
      phone: "+94 66 2284 334",
      email: "info@dambullacavetemple.lk"
    }
  },
  {
    name: "Arugam Bay",
    description: "One of the top surf destinations in the world, offering perfect breaks for surfers of all levels. The laid-back coastal town also features beautiful beaches, lagoons, and cultural sites nearby.",
    category: "Adventure",
    location: {
      coordinates: {
        lat: 6.8391,
        lng: 81.8340
      }
    },
    images: ["https://example.com/images/arugam-bay1.jpg", "https://example.com/images/arugam-bay2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 63 2248 111",
      email: "surf@arugambay.lk"
    }
  },
  {
    name: "Horton Plains National Park",
    description: "A protected highland area featuring misty landscapes, unique biodiversity, and the famous World's End cliff. The park offers beautiful hiking trails through cloud forests and grasslands.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 6.8021,
        lng: 80.8083
      }
    },
    images: ["https://example.com/images/horton-plains1.jpg", "https://example.com/images/horton-plains2.jpg"],
    openingHours: {
      open: "6:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 52 2234 107",
      email: "info@hortonplains.lk"
    }
  },
  {
    name: "Nuwara Eliya",
    description: "Known as 'Little England', this charming hill station features colonial architecture, tea plantations, and cool climate. Famous for its gardens, golf course, and scenic Gregory Lake.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 6.9497,
        lng: 80.7891
      }
    },
    images: ["https://example.com/images/nuwara-eliya1.jpg", "https://example.com/images/nuwara-eliya2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 52 2222 275",
      email: "tourism@nuwaraeliya.lk"
    }
  },
  {
    name: "Pidurangala Rock",
    description: "Located near Sigiriya, this ancient rock temple offers stunning views of the surrounding landscape and Sigiriya Rock. The moderate climb rewards visitors with breathtaking sunrise and sunset views.",
    category: "Adventure",
    location: {
      coordinates: {
        lat: 7.9759,
        lng: 80.7542
      }
    },
    images: ["https://example.com/images/pidurangala1.jpg", "https://example.com/images/pidurangala2.jpg"],
    openingHours: {
      open: "5:00",
      close: "19:00"
    },
    contactInfo: {
      phone: "+94 66 2286 233",
      email: "info@pidurangala.lk"
    }
  },
  {
    name: "Bentota Beach",
    description: "A pristine beach destination offering water sports, luxury resorts, and beautiful sunsets. Known for its golden sands and water activities like jet skiing, windsurfing, and river safaris.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 6.4213,
        lng: 79.9969
      }
    },
    images: ["https://example.com/images/bentota1.jpg", "https://example.com/images/bentota2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 34 2275 176",
      email: "info@bentota.lk"
    }
  },
  {
    name: "Anuradhapura Ancient City",
    description: "The first ancient capital of Sri Lanka, featuring well-preserved ruins of ancient palaces, monasteries, and stupas. This UNESCO World Heritage site holds significant historical and religious importance.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 8.3114,
        lng: 80.4037
      }
    },
    images: ["https://example.com/images/anuradhapura1.jpg", "https://example.com/images/anuradhapura2.jpg"],
    openingHours: {
      open: "7:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 25 2222 275",
      email: "archaeology@anuradhapura.lk"
    }
  },
  {
    name: "Nine Arch Bridge",
    description: "A colonial-era railway bridge in Ella, famous for its beautiful architecture and scenic location. The stone bridge surrounded by lush tea plantations is a popular spot for photography.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 6.8789,
        lng: 81.0594
      }
    },
    images: ["https://example.com/images/nine-arch1.jpg", "https://example.com/images/nine-arch2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 57 2228 739",
      email: "tourism@ella.lk"
    }
  },
  {
    name: "Udawalawe National Park",
    description: "Famous for its large elephant population, this national park offers excellent wildlife viewing opportunities. Visitors can spot various bird species, water buffalo, crocodiles, and occasionally leopards.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 6.4389,
        lng: 80.8950
      }
    },
    images: ["https://example.com/images/udawalawe1.jpg", "https://example.com/images/udawalawe2.jpg"],
    openingHours: {
      open: "6:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 47 2232 255",
      email: "info@udawalawenp.lk"
    }
  },
  {
    name: "Mihintale",
    description: "Considered the birthplace of Buddhism in Sri Lanka, this mountain peak features ancient ruins, rock inscriptions, and religious monuments. The site holds great historical and religious significance.",
    category: "Religious",
    location: {
      coordinates: {
        lat: 8.3511,
        lng: 80.5217
      }
    },
    images: ["https://example.com/images/mihintale1.jpg", "https://example.com/images/mihintale2.jpg"],
    openingHours: {
      open: "7:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 25 2266 445",
      email: "info@mihintale.lk"
    }
  },
  {
    name: "Trincomalee",
    description: "A port city known for its natural harbor, beautiful beaches, and colonial history. Visitors can enjoy Nilaveli and Uppuveli beaches, hot springs, and the historic Fort Frederick.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 8.5672,
        lng: 81.2335
      }
    },
    images: ["https://example.com/images/trincomalee1.jpg", "https://example.com/images/trincomalee2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 26 2222 651",
      email: "tourism@trincomalee.lk"
    }
  },
  {
    name: "Knuckles Mountain Range",
    description: "A UNESCO World Heritage site offering diverse landscapes, endemic flora and fauna, and challenging hiking trails. The mountain range gets its name from its resemblance to knuckles of a clenched fist.",
    category: "Adventure",
    location: {
      coordinates: {
        lat: 7.4608,
        lng: 80.7972
      }
    },
    images: ["https://example.com/images/knuckles1.jpg", "https://example.com/images/knuckles2.jpg"],
    openingHours: {
      open: "6:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 81 2234 100",
      email: "info@knucklesmountain.lk"
    }
  },
  {
    name: "Little Adam's Peak",
    description: "A smaller, more accessible version of Adam's Peak, offering panoramic views of Ella Gap and surrounding landscapes. The moderate hike takes about 45 minutes to reach the summit.",
    category: "Adventure",
    location: {
      coordinates: {
        lat: 6.8691,
        lng: 81.0592
      }
    },
    images: ["https://example.com/images/little-adams-peak1.jpg", "https://example.com/images/little-adams-peak2.jpg"],
    openingHours: {
      open: "5:00",
      close: "19:00"
    },
    contactInfo: {
      phone: "+94 57 2228 739",
      email: "tourism@ella.lk"
    }
  },
  {
    name: "Hikkaduwa Beach",
    description: "A popular beach destination known for its coral reefs, surfing spots, and vibrant nightlife. Visitors can enjoy water sports, glass-bottom boat rides, and fresh seafood restaurants.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 6.1341,
        lng: 80.1015
      }
    },
    images: ["https://example.com/images/hikkaduwa1.jpg", "https://example.com/images/hikkaduwa2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 91 2277 723",
      email: "tourism@hikkaduwa.lk"
    }
  },
  {
    name: "Minneriya National Park",
    description: "Famous for 'The Gathering,' where hundreds of elephants congregate around the Minneriya Tank during the dry season. The park also houses various bird species, deer, and crocodiles.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 8.0344,
        lng: 80.9022
      }
    },
    images: ["https://example.com/images/minneriya1.jpg", "https://example.com/images/minneriya2.jpg"],
    openingHours: {
      open: "6:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 27 2222 255",
      email: "info@minneriya.lk"
    }
  },
  {
    name: "Gangaramaya Temple",
    description: "A significant Buddhist temple in Colombo featuring a mix of Sri Lankan, Thai, Indian, and Chinese architecture. The temple houses numerous artifacts, a library, and a museum.",
    category: "Religious",
    location: {
      coordinates: {
        lat: 6.9167,
        lng: 79.8563
      }
    },
    images: ["https://example.com/images/gangaramaya1.jpg", "https://example.com/images/gangaramaya2.jpg"],
    openingHours: {
      open: "6:00",
      close: "22:00"
    },
    contactInfo: {
      phone: "+94 11 2435 169",
      email: "info@gangaramaya.lk"
    }
  },
  {
    name: "Sinharaja Forest Reserve",
    description: "A UNESCO World Heritage site and biodiversity hotspot, home to numerous endemic species of plants and animals. The dense rainforest offers hiking trails, birdwatching, and encounters with rare wildlife.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 6.4000,
        lng: 80.5000
      }
    },
    images: ["https://example.com/images/sinharaja1.jpg", "https://example.com/images/sinharaja2.jpg"],
    openingHours: {
      open: "6:30",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 45 2222 889",
      email: "info@sinharaja.lk"
    }
  },
  {
    name: "Negombo Beach",
    description: "A popular beach destination close to Colombo International Airport, known for its golden sands, fresh seafood, and vibrant nightlife. The beach is lined with hotels, restaurants, and bars.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 7.2048,
        lng: 79.8425
      }
    },
    images: ["https://example.com/images/negombo1.jpg", "https://example.com/images/negombo2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 31 2222 200",
      email: "tourism@negombo.lk"
    }
  },
  {
    name: "Wilpattu National Park",
    description: "Sri Lanka's largest national park known for its leopards, sloth bears, and natural lakes called 'villus'. The diverse habitat supports numerous species of mammals, birds, reptiles, and plants.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 8.4550,
        lng: 80.0144
      }
    },
    images: ["https://example.com/images/wilpattu1.jpg", "https://example.com/images/wilpattu2.jpg"],
    openingHours: {
      open: "6:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 11 2888 585",
      email: "info@wilpattu.lk"
    }
  },
  {
    name: "Pinnawala Elephant Orphanage",
    description: "A conservation facility for orphaned and injured elephants established in 1975. Visitors can observe elephant feeding, bathing, and daily routines while learning about conservation efforts.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 7.3012,
        lng: 80.3842
      }
    },
    images: ["https://example.com/images/pinnawala1.jpg", "https://example.com/images/pinnawala2.jpg"],
    openingHours: {
      open: "8:30",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 35 2265 284",
      email: "info@pinnawalaelephants.lk"
    }
  },
  {
    name: "Koneswaram Temple",
    description: "An ancient Hindu temple located on Swami Rock in Trincomalee, overlooking the Indian Ocean. The temple dedicated to Lord Shiva dates back to 205 BC and offers spectacular views.",
    category: "Religious",
    location: {
      coordinates: {
        lat: 8.5811,
        lng: 81.2316
      }
    },
    images: ["https://example.com/images/koneswaram1.jpg", "https://example.com/images/koneswaram2.jpg"],
    openingHours: {
      open: "6:00",
      close: "20:00"
    },
    contactInfo: {
      phone: "+94 26 2222 479",
      email: "info@koneswaram.lk"
    }
  },
  {
    name: "Beruwala",
    description: "A coastal town known for its golden beaches, fishing harbor, and as the oldest Muslim settlement in Sri Lanka. The area features a lighthouse, water sports facilities, and Ayurvedic spas.",
    category: "Beach",
    location: {
      coordinates: {
        lat: 6.4773,
        lng: 79.9825
      }
    },
    images: ["https://example.com/images/beruwala1.jpg", "https://example.com/images/beruwala2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 34 2276 789",
      email: "tourism@beruwala.lk"
    }
  },
  {
    name: "Kitulgala",
    description: "A small town known for white water rafting, jungle hikes, and birdwatching. It was also the filming location for the movie 'The Bridge on the River Kwai' and offers various adventure activities.",
    category: "Adventure",
    location: {
      coordinates: {
        lat: 6.9901,
        lng: 80.4120
      }
    },
    images: ["https://example.com/images/kitulgala1.jpg", "https://example.com/images/kitulgala2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 36 2287 430",
      email: "adventure@kitulgala.lk"
    }
  },
  {
    name: "Jaffna",
    description: "The cultural capital of the Tamil population in Sri Lanka, featuring unique architecture, cuisine, and traditions. Visitors can explore the Jaffna Fort, Nallur Kandaswamy Temple, and Casuarina Beach.",
    category: "Cultural",
    location: {
      coordinates: {
        lat: 9.6612,
        lng: 80.0255
      }
    },
    images: ["https://example.com/images/jaffna1.jpg", "https://example.com/images/jaffna2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 21 2222 275",
      email: "tourism@jaffna.lk"
    }
  },
  {
    name: "Ravana Falls",
    description: "A popular waterfall near Ella, associated with the legend of King Ravana from the Ramayana. The 25-meter-high cascade is easily accessible from the main road and offers a refreshing swim spot.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 6.8038,
        lng: 81.0430
      }
    },
    images: ["https://example.com/images/ravana-falls1.jpg", "https://example.com/images/ravana-falls2.jpg"],
    openingHours: {
      open: "24/7",
      close: "24/7"
    },
    contactInfo: {
      phone: "+94 57 2228 739",
      email: "tourism@ella.lk"
    }
  },
  {
    name: "Ramboda Falls",
    description: "One of the highest waterfalls in Sri Lanka, cascading from a height of 109 meters. Located between Nuwara Eliya and Kandy, the falls offer a scenic stop along the mountain roads.",
    category: "Nature",
    location: {
      coordinates: {
        lat: 7.0565,
        lng: 80.6968
      }
    },
    images: ["https://example.com/images/ramboda1.jpg", "https://example.com/images/ramboda2.jpg"],
    openingHours: {
      open: "7:00",
      close: "18:00"
    },
    contactInfo: {
      phone: "+94 52 2256 711",
      email: "info@rambodafalls.lk"
    }
  }
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await Place.deleteMany({});
    console.log('Cleared existing places data');

    // Insert new data
    const result = await Place.insertMany(sriLankaPlaces);
    console.log(`Successfully inserted ${result.length} places`);

    console.log('Seeding completed successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();