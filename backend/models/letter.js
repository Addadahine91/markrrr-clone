const mongoose = require('mongoose');

const letterSchema = mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: false },
    lastModified: { type: String, required: false}
});

module.exports = mongoose.model('Letter', letterSchema);