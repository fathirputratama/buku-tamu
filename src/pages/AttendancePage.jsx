import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TambahAttendance = () => {
  const [name_attendance, setNameAttendance] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const { guid_event } = useParams();

  const handleAddAttendance = async () => {
    const dataAttendance = {
      name_attendance,
      email,
      phone_number,
    };

    const token = localStorage.getItem("token");

    try {
      // console.log("guid_event:", guid_event); // Log guid_event to ensure it's correct
      const response = await axios.post(
        `https://635f-103-255-156-10.ngrok-free.app/attendance/addattendance/${guid_event}`,
        dataAttendance,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Attendance created successfully:", response.data);
      setNameAttendance("");
      setEmail("");
      setPhoneNumber("");
      window.alert("Data berhasil ditambahkan!");
    } catch (error) {
      console.error("Failed to create attendance:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D7FBE8] px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-black font-bold text-3xl tracking-wider mb-3 text-center">
          Tambah Kehadiran
        </h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="form-label mt-2 text-sm text-black font-bold">
              Nama Lengkap
            </label>
            <input
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              type="text"
              id="name"
              name="name"
              placeholder="Masukan nama lengkap"
              value={name_attendance}
              onChange={(e) => setNameAttendance(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="form-label mt-2 text-sm text-black font-bold">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Masukan email"
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone_number" className="form-label mt-2 text-sm text-black font-bold">
              No. Telepon
            </label>
            <input
              className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              type="text"
              id="phone_number"
              name="phone_number"
              placeholder="Masukan no. telepon"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <Button className="w-full mt-4 bg-[#A5D9D0] text-black" onClick={handleAddAttendance}>
          Tambah Kehadiran
        </Button>
      </div>
    </div>
  );
};

export default TambahAttendance;
