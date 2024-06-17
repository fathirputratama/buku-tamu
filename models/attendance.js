const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    guid_attendance: {
        type: String,
        unique: true,
        required: true,
    },
    guid_event: {
        type: String,
        required: true,
        ref: 'event'
    },
    name_attendance: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['on time', 'late'],
        required: true,
        immutable: true
    }
});

// attendanceSchema.pre('save', async function (next) {
//     if (this.isNew) {
//         const Event = mongoose.model('Event');
//         const event = await Event.findOne({ guid_event: this.guid_event });
        
//         if (!event) {
//             const error = new Error('Event not found');
//             return next(error);
//         }

//         const currentTimestamp = Math.floor(Date.now() / 1000);
//         this.status = (currentTimestamp > event.timestamp + 15 * 60) ? 'late' : 'on time';
//     }
//     next();
// });

module.exports = mongoose.model('Attendance', attendanceSchema);
