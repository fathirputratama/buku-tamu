import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoCloseOutline } from "react-icons/io5";
import axios from "axios";

// eslint-disable-next-line react/prop-types
const TambahAttendance = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleAddAttendance = async () => {
    // Convert timestamp to Unix timestamp (milliseconds since 1970)
    const unixTimestamp = new Date(timestamp).getTime();
  
    const eventData = {
      name,
      timestamp: formatTime,
      location,
      notes,
    };
  
    // Get token from localStorage
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        "https://635f-103-255-156-10.ngrok-free.app/event/addevent",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      console.log("Event created successfully:", response.data);
      // Reset the form
      setName("");
      setTimestamp("");
      setLocation("");
      setNotes("");
      handleClose();
      // Show success alert
      window.alert("Data berhasil ditambahkan!");
    } catch (error) {
      console.error("Failed to create event:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <Dialog
      open={isOpen}
      size="sm"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogBody>
        <IoCloseOutline className="float-end text-black text-5xl" onClick={handleClose} />
        <h1 className="text-black font-bold text-3xl tracking-wider mb-3">
          Tambah Event
        </h1>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="form-label mt-2 text-sm text-black font-bold">
              Nama Kegiatan
            </label>
            <input
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              type="text"
              id="name"
              name="name"
              placeholder="Masukan nama kegiatan"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="timestamp" className="form-label mt-2 text-sm text-black font-bold">
              Waktu
            </label>
            <input
              type="datetime-local"
              id="timestamp"
              name="timestamp"
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="location" className="form-label mt-2 text-sm text-black font-bold">
              Lokasi
            </label>
            <input
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              type="text"
              id="location"
              name="location"
              placeholder="Masukan lokasi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="notes" className="form-label mt-2 text-sm text-black font-bold">
              Catatan
            </label>
            <input
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
              type="text"
              id="notes"
              name="notes"
              placeholder="Masukan catatan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button className="w-full mr-4 bg-[#A5D9D0] text-black" onClick={handleAddAttendance}>
          Tambah Event
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default TambahAttendance;
