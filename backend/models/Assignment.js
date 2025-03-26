const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    name: String,
    roomType: String,
    roomNo: String,
    rateAmount: Number,
    assignedButler: String,
    begin_date: String, // formato DD-MM-YY o YYYY-MM-DD como string
    departure_date: String,
    status: { type: String, default: 'unknown' },
    checkedOutTime: Date
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
