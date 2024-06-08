const mongoose = require('mongoose');

const connectToDatabase = () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection.asPromise();
    }

    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const NameSchema = new mongoose.Schema({
    name1: String,
    name2: String,
});

const Names = mongoose.models.Names || mongoose.model('Names', NameSchema);

module.exports = async (req, res) => {
    await connectToDatabase();

    const { name1, name2 } = req.body;
    const newNames = new Names({ name1, name2 });
    await newNames.save();
    res.send({ message: 'Names saved successfully' });
};
