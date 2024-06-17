// controllers/attendance.js
const Attendance = require('../models/attendance');
const { v4: uuidv4 } = require('uuid');
const Event = require('../models/event')

// Controller
// Controller
exports.createAttendance = async (req, res) => {
    try {
        const guid_event = req.params.guid_event;
        
        if (!guid_event) {
            return res.status(404).send({ message: 'No Event Found!' });
        }

        // Ambil waktu acara dari basis data
        const event = await Event.findOne({ guid_event });
        if (!event) {
            return res.status(404).send({ message: 'Event not found!' });
        }

        // Hitung waktu akhir toleransi keterlambatan (15 menit setelah waktu acara)
        const lateThreshold = event.timestamp + (15 * 60 * 1000); // Menjadi milidetik

        // Tentukan status berdasarkan waktu kehadiran
        let status;
        if (Date.now() > lateThreshold) {
            status = 'late';
        } else {
            status = 'on time';
        }

        // Buat entri kehadiran dengan status yang ditentukan
        const attendance = new Attendance({
            guid_attendance: uuidv4(),
            guid_event: guid_event,
            name_attendance: req.body.name_attendance,
            email: req.body.email,
            phone_number: req.body.phone_number,
            status: status // Set status yang sudah ditentukan
        });

        // Simpan entri kehadiran ke basis data
        await attendance.save();
        res.status(201).send(attendance);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};



exports.getAttendance = async (req, res) => {
    try {
        const guid_event = req.params.guid_event;

        if (!guid_event) {
            return res.status(404).send({ message: 'No Event Found!' });
        }

        const attendanceRecords = await Attendance.find({ guid_event: guid_event });

        res.status(200).send(attendanceRecords);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};
