import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";
import Swal from 'sweetalert2';

const EditEvent = ({ isOpen, onClose, event, onUpdateEvent }) => {
  const [formData, setFormData] = useState({
    name: "",
    timestamp: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        timestamp: new Date(event.timestamp).toISOString().slice(0, 16), // Format for datetime-local input
        location: event.location,
        notes: event.notes || "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      };

      const payload = {
        name: formData.name,
        timestamp: new Date(formData.timestamp).getTime(), // Convert to Unix timestamp
        location: formData.location,
        notes: formData.notes,
      };

      const response = await axios.put(
        `https://635f-103-255-156-10.ngrok-free.app/event/${event.guid_event}`,
        payload,
        { headers: headers }
      );

      if (response.status === 200) {
        onUpdateEvent(response.data.event);
        onClose();
        Swal.fire({
          icon: 'success',
          title: 'Event Updated!',
          text: 'Event successfully updated.',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Update Event',
          text: 'Failed to update the event. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error:", error.response || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error Occurred',
        text: error.response?.data?.message || error.message || 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <Dialog open={isOpen} size="sm" animate={{ mount: { scale: 1, y: 0 }, unmount: { scale: 0.9, y: -100 } }}>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <IoCloseOutline className="float-end text-black text-5xl" onClick={handleClose} />
          <h1 className="text-black font-bold text-3xl tracking-wider mb-3">Edit Event</h1>

          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="form-label mt-2 text-sm text-black font-bold">Nama Kegiatan</label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukan nama kegiatan"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="timestamp" className="form-label mt-2 text-sm text-black font-bold">Waktu</label>
              <input
                type="datetime-local"
                id="timestamp"
                name="timestamp"
                value={formData.timestamp}
                onChange={handleChange}
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="location" className="form-label mt-2 text-sm text-black font-bold">Lokasi</label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Masukan lokasi"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="notes" className="form-label mt-2 text-sm text-black font-bold">Catatan</label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Masukan catatan"
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button type="submit" className="w-full mr-4 bg-[#A5D9D0] text-black">Update Event</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default EditEvent;
