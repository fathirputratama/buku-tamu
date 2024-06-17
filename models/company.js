const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guid_company: {
        type: String,
        unique: true,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    alamat: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    no_telp: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
    },
});

module.exports = mongoose.model('company', schema);
