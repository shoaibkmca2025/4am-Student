
import mongoose from 'mongoose';

const assessmentSchema = mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  questionsCount: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  color: { type: String, default: 'blue' },
  questions: [{
    id: { type: Number },
    type: { 
      type: String, 
      enum: ['multiple-choice', 'code-challenge', 'text-input'], 
      default: 'multiple-choice' 
    },
    question: { type: String, required: true },
    options: [{ type: String }], // Optional for non-MCQ
    correct: { type: Number }, // For MCQs (index)
    correctAnswer: { type: String }, // For text-input
    codeSnippet: { type: String }, // For code-challenge
    explanation: { type: String } // Optional explanation for all types
  }]
}, {
  timestamps: true
});

const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

export default Assessment;
