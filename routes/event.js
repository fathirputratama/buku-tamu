module.exports = app => {
    const eventController =  require ('../controllers/event')
    const router = require('express').Router();
    const authenticateToken = require('../middleware/index')

    router.post('/addevent',authenticateToken, eventController.createEvent);
    router.get('/events', authenticateToken , eventController.getAllEventsByCompany)
    router.put('/:guid_event', authenticateToken , eventController.updateEvent)
    router.delete('/events/:guid_event', authenticateToken, eventController.deleteEvent);
    router.get('/:guid_event',authenticateToken,eventController.getEventByGuidCompany)


    app.use('/event', router)
}