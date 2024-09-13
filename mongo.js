const mongoose = require('mongoose');

args_length = process.argv.length
if (args_length < 3) {
    console.log("Wrong number of arguments inserted");
    console.log("<Usage>: node mongo.js <mongodbpassword> [<contact_name> <contact_number> ]");
    process.exit(1);
}
console.log("Here 1")

const password = process.argv[2];
const url =
    `mongodb+srv://fullstack:${password}@cluster0.jkdhc.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

console.log("Here 2")

mongoose.set("strictQuery", false);
mongoose.connect(url);
console.log("Here 3")

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
});

const PhoneBook = mongoose.model('PhoneBook', phonebookSchema);

if (args_length > 3 && args_length < 6) {
    const contactName = process.argv[3];
    const contactPhone = process.argv[4];
    
    const contact = new PhoneBook({
        name: contactName,
        number: contactPhone
    })

    contact.save().then(result => {
        console.log("added", contactName, "number ", contactPhone, "to phonebook");
        console.log(result);
        mongoose.connection.close();
    })
} else {
    PhoneBook.find({}).then(result => {
        console.log("phonebook:\n");
        result.forEach(contact => {
            console.log(contact);
            mongoose.connection.close();
        })
    })
}






