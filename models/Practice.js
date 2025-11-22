import mongoose from 'mongoose';

const practiceSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    word: {
        type: String,
        required: true
    },
    pronunciation: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['spelling', 'pronunciation'],
        default: 'pronunciation'
    }
}, {
    timestamps: true
});

const Practice = mongoose.model('Practice', practiceSchema);

export default Practice;
