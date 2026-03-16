const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect(
        'mongodb+srv://Namaste-Node-Cluster:xt2bDS0cKAJB75Dl@namaste-node-cluster.mfkxvqn.mongodb.net/devTinder'
    );
}

module.exports = connectDB;