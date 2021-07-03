const mongoose = require('mongoose');

const snippetSchema = mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Snippet', snippetSchema);