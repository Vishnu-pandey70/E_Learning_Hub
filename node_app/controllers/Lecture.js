const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: { type: String, trim: true, required: true },
    video: { type: String, trim: true, required: true },
    notes: { type: String, trim: true },
    assignment : { type: String, trim: true }
}, { timestamps: true});

const Lecture = mongoose.model("Lecture",lectureSchema)
module.exports = Lecture;