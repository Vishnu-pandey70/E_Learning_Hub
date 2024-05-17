const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  rating: { type: Number, required: true, min: 0, max: 5 },
  feedback: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now } 
});




const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, min: 0,default:0},
  mentor: { type: String, required: true, trim: true },
  image: { type: String, trim: true, default: 'https://images.unsplash.com/photo-1531323386183-43890b5c766d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ratings: [{ type: Number, min: 0, max: 5 }],
  feedbacks: [feedbackSchema],
  lectureIds: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Lecture'
    }
  ],
}, {
  timestamps: true 
}
);

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
