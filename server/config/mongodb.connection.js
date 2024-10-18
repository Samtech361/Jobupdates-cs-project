const mongoose = require('mongoose')
const URI = process.env.MONGODB_URI

mongoose.connect(URI, {dbName: 'Jobupdates'})
.then(console.log('MongoDb connected...'))
.catch((error)=>{
    console.log(error.message);
})

mongoose.connection.on('disconnected', ()=>{
    console.log('Mongodb is disconnected')
})

process.on('SIGINT', async()=>{
    await mongoose.connection.close();
    process.exit()
})