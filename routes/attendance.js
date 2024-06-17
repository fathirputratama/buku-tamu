module.exports = app => {
    const attendanceController = require('../controllers/attendance');
    const router = require('express').Router();

    router.post('/addattendance/:guid_event', attendanceController.createAttendance);
    router.get('/attendanceslist/:guid_event', attendanceController.getAttendance);
    
    app.use('/attendance', router);
};
