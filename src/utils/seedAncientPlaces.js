// src/utils/seedAncientPlaces.js
const mongoose = require('mongoose');
require('dotenv').config();
const Place = require('../../models/Place'); 

const ancientPlacesData = [
  // Ancient Cities and Major Sites
  { name: "Anuradhapura", location: "North Central Province", description: "First ancient capital (4th century BCE to 11th century CE)", category: "Ancient Cities", isPopular: true },
  { name: "Polonnaruwa", location: "North Central Province", description: "Second ancient capital (11th-13th centuries CE)", category: "Ancient Cities", isPopular: true },
  { name: "Sigiriya", location: "Central Province", description: "Ancient rock fortress and palace (5th century CE)", category: "Ancient Cities", isPopular: true },
  { name: "Dambulla Cave Temple", location: "Central Province", description: "Ancient Buddhist cave complex (1st century BCE)", category: "Religious Sites", isPopular: true },
  { name: "Kandy", location: "Central Province", description: "Last royal capital of Sri Lanka", category: "Ancient Cities", isPopular: true },
  { name: "Yapahuwa", location: "North Western Province", description: "Medieval palace and fortress", category: "Ancient Cities" },
  { name: "Mihintale", location: "North Central Province", description: "Birthplace of Buddhism in Sri Lanka", category: "Religious Sites", isPopular: true },
  { name: "Tissamaharama", location: "Southern Province", description: "Ancient capital of southern Sri Lanka", category: "Ancient Cities" },
  
  // Lesser-Known Ancient Cities and Capitals
  { name: "Panduwasnuwara", location: "North Western Province", description: "Ancient capital before Polonnaruwa", category: "Ancient Cities" },
  { name: "Kurunegala", location: "North Western Province", description: "Brief medieval capital (13th century)", category: "Ancient Cities" },
  { name: "Dambadeniya", location: "North Western Province", description: "Medieval capital (13th century)", category: "Ancient Cities" },
  { name: "Gampola", location: "Central Province", description: "14th century capital", category: "Ancient Cities" },
  { name: "Kotte", location: "Western Province", description: "15th-16th century capital", category: "Ancient Cities" },
  { name: "Sitawaka", location: "Western Province", description: "16th century kingdom", category: "Ancient Cities" },
  { name: "Ruhuna", location: "Southern Province", description: "Ancient kingdom in southern Sri Lanka", category: "Ancient Cities" },
  { name: "Tambapanni", location: "North Western Province", description: "Legendary first settlement of King Vijaya", category: "Ancient Cities" },
  
  // Ancient Religious Complexes
  { name: "Sri Maha Bodhi", location: "Anuradhapura", description: "Oldest documented tree (planted 288 BCE)", category: "Religious Sites", isPopular: true },
  { name: "Isurumuniya", location: "North Central Province", description: "Rock temple with notable carvings", category: "Religious Sites" },
  { name: "Aluvihara Rock Cave Temple", location: "Central Province", description: "Where Buddhist texts were first written", category: "Religious Sites" },
  { name: "Ramba Viharaya", location: "Southern Province", description: "Ancient temple complex in southern Sri Lanka", category: "Religious Sites" },
  { name: "Kataragama", location: "Uva Province", description: "Ancient multi-religious site", category: "Religious Sites", isPopular: true },
  { name: "Sithulpawwa", location: "Southern Province", description: "2nd century BCE rock temple", category: "Religious Sites" },
  { name: "Tantirimale", location: "Northern Province", description: "Ancient temple with rock-cut Buddha figures", category: "Religious Sites" },
  { name: "Rajagala (Rassagala)", location: "Eastern Province", description: "Massive ancient Buddhist monastery complex", category: "Religious Sites" },
  { name: "Girihadu Seya", location: "Northern Province", description: "Claimed to be the first stupa in Sri Lanka", category: "Religious Sites" },
  { name: "Neelagiri Seya", location: "North Central Province", description: "Recently excavated ancient stupa", category: "Religious Sites" },
  
  // These are some of the entries - add all 72 places from your frontend file for completeness
];

// Connect to MongoDB
const seedAncientPlaces = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding ancient places');

    // Optional: Clear existing ancient places data (be careful with this)
    // If you want to clear only ancient places categories and not others:
    const categories = [
      'Ancient Cities', 'Religious Sites', 'Engineering Marvels', 
      'Royal Residences', 'Rock Art', 'Prehistoric Sites', 'Sacred Mountains'
    ];
    await Place.deleteMany({ category: { $in: categories } });
    console.log('Cleared existing ancient places data');

    // Insert new data
    const result = await Place.insertMany(ancientPlacesData);
    console.log(`Successfully inserted ${result.length} ancient places`);

    console.log('Seeding completed successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedAncientPlaces();