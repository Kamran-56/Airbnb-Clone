


const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    houseName: { type: String, required: true }, // Name of the house, must be a String and is mandatory
    price: { type: Number, required: true },      // Price of the house, must be a Number and is mandatory
    location: { type: String, required: true },   // Location of the house, must be a String and is mandatory
    rating: { type: Number, required: true },     // Rating of the house, must be a Number and is mandatory
    photoUrl: { type: String},                     // URL of the house photo, must be a String (optional, not required)
    description: { type: String}                  // Description of the house, must be a String (optional, not required)
});



// findOneAndDelete is unambiguous — no options needed
// homeSchema.pre('findOneAndDelete', async function() {
//     console.log("findOneAndDelete hook fired, deleting favourites for:", this.getQuery()._id);
//     const homeId = this.getQuery()._id;
//     await Favourites.deleteMany({ houseID: homeId });
// });

// deleteOne/deleteMany need explicit query:true since you call them on the Model
homeSchema.pre('deleteOne', { document: false, query: true }, async function() {
    console.log("deleteOne hook fired, deleting favourites for:", this.getQuery()._id);
    const homeId = this.getQuery()._id;
    await Favourites.deleteMany({ houseID: homeId });
});

homeSchema.pre('deleteMany', { document: false, query: true }, async function() {
    const filter = this.getQuery();
    console.log("deleteMany hook fired, deleting favourites for:", filter._id);
    await Favourites.deleteMany({ houseID: filter._id });
});



// Create a Mongoose model named "Home" based on the homeSchema
// This model acts as an interface to interact with the "homes" collection in MongoDB
const Home = mongoose.model('Home', homeSchema);


// Export the Home model so it can be imported and used in other files
module.exports = Home;
