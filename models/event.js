const mongoose =  require('mongoose');

const eventSchema = new mongoose.Schema({
    guid_event :{
        type: String,
        unique: true,
        required: true,
    },
    guid_company: {
        type: String,
        required: true,
        ref: 'company'
    },
    name: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    notes: {
        type: String
    }
});

module.exports = mongoose.model('event', eventSchema)