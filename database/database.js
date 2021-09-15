const mongoose = require("mongoose")

async function dbConnection(){
  await mongoose.connect("mongodb+srv://ChetanDhangar:hewlettdhangar@chetan-dhangar-ecommerc.xp6jj.mongodb.net/check-chess21?retryWrites=true&w=majority",
{useNewUrlParser: true, useUnifiedTopology: true})
}
const db = mongoose.connection
console.log("from db")
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',  () => console.log("db connected"))

module.exports = dbConnection