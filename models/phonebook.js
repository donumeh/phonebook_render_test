const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.log("Connection couldn't be established", error.message)
});

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject.__v;
        delete returnedObject._id;
    }
})

module.exports = mongoose.model('Phonebook', phonebookSchema);

