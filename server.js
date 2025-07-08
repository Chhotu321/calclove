const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/love_calculator', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a schema and model
const NameSchema = new mongoose.Schema({
    name1: String,
    name2: String,
});

const Names = mongoose.model('Names', NameSchema);

// API endpoint to save names
app.post('/api/save-names', async (req, res) => {
    const { name1, name2 } = req.body;
    const newNames = new Names({ name1, name2 });
    await newNames.save();
    res.send({ message: 'Names saved successfully' });
});

// API endpoint to retrieve the latest names
app.get('/api/get-names', async (req, res) => {
    const latestNames = await Names.findOne().sort({ _id: -1 }).exec();
    res.send(latestNames);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
