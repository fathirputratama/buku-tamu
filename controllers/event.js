const Event = require('../models/event');
const { v4: uuidv4 } = require('uuid');

exports.createEvent = async (req, res) => {
    try {
        const guid_company = req.user.guid_company;

        if (!guid_company) {
            return res.status(404).send({ message: 'No company found in token' });
        }

        const guid = uuidv4();

        const event = new Event({
            guid_event: guid,
            guid_company: guid_company,
            name: req.body.name,
            timestamp: req.body.timestamp,
            location: req.body.location,
            notes: req.body.notes
        });

        await event.save();
        res.status(201).send(event);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getEventByGuidCompany = (req, res) => {
    const guid_company = req.user.guid_company;
    const guid_event = req.params.guid_event;

    Event.findOne({ guid_company: guid_company, guid_event: guid_event })
        .then(event => {
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
            res.json({ status: true, code: 200, event });
        })
        .catch(err => res.status(400).json({ message: err.message }));
};


exports.updateEvent = async (req, res) => {
  try {
      const guid_company = req.user.guid_company;
      const updatedEvent = req.body; // Mengambil data yang akan diupdate dari request body

      // Memastikan bahwa event yang akan diperbarui ditemukan dan dimiliki oleh perusahaan yang sesuai
      const event = await Event.findOneAndUpdate(
          { guid_event: req.params.guid_event, guid_company: guid_company },
          updatedEvent, // Menggunakan data yang diperbarui
          { new: true }
      );

      // Jika event tidak ditemukan, kirim respon dengan status 404
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Jika event berhasil diperbarui, kirim respon dengan event yang telah diperbarui
      res.json({status: true, code: 200, message: "Data berhasil diupdate", event});
  } catch (error) {
      // Jika terjadi kesalahan, kirim respon dengan status 400 dan pesan kesalahan
      res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
    try {
        const guid_company = req.user.guid_company;
        const guid_event = req.params.guid_event;

        const event = await Event.findOneAndDelete({
            guid_event: guid_event,
            guid_company: guid_company
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.getAllEventsByCompany = (req, res) => {
    const guid_company = req.user.guid_company;

    Event.find({ guid_company: guid_company })
        .then(events => {
            if (!events || events.length === 0) {
                return res.status(404).json({ message: 'No events found for this company' });
            }
            res.json({ status: true, code: 200, events });
        })
        .catch(err => res.status(400).json({ message: err.message }));
};