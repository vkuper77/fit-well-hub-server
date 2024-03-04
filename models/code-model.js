const {Schema, model} = require('mongoose');

const CodeSchema = new Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
})

module.exports = model('Code', CodeSchema);
