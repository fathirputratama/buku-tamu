import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { IoMdClose } from "react-icons/io";
import Swal from 'sweetalert2';

// eslint-disable-next-line react/prop-types
const EditProfile = ({ isOpen, onClose, profiles, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_telp: "",
    alamat: "",
    password: "",
    image: ""
  });

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (profiles) {
      setFormData({
        nama: profiles.nama,
        email: profiles.email,
        no_telp: profiles.no_telp,
        alamat: profiles.alamat,
        password: "", // Keep the password field empty initially
        image: profiles.image
      });
    }
  }, [profiles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Filter out unchanged fields from formData
    const updatedData = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] && formData[key] !== profiles[key]) {
        updatedData[key] = formData[key];
      }
    });
    handleUpdateProfile(updatedData);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      // Call the actual onUpdateProfile function
      await onUpdateProfile(updatedData);
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Data berhasil diperbarui!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error(error);
      // Show error message if updating profile fails
      Swal.fire({
        icon: 'error',
        title: 'Gagal memperbarui data',
        text: error.message,
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      size="sm" // Ubah ukuran modal menjadi kecil (small)
      className="h-[80%] overflow-y-auto"
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <IoMdClose
            className="cursor-pointer w-9 h-9 float-end text-black"
            onClick={handleClose}
          />
          <h1 className="text-black font-bold text-3xl tracking-wider mb-3">
            Edit Pengguna
          </h1>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col">
              <label
                htmlFor="nama"
                className="form-label mt-2 text-sm text-black font-bold"
              >
                Nama Perusahaan
              </label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="form-label mt-2 text-sm text-black font-bold"
              >
                E-mail
              </label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="no_telp"
                className="form-label mt-2 text-sm text-black font-bold"
              >
                No Telepon
              </label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="no_telp"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="alamat"
                className="form-label mt-2 text-sm text-black font-bold"
              >
                Alamat
              </label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="text"
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="form-label mt-2 text-sm text-black font-bold"
              >
                Password Baru
              </label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="password" // Change input type to password
                id="password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="image"
                className="form-label mt-2 text-sm text-black font-bold"
              >
                Foto Profil
              </label>
              <input
                className="bg-gray-50 border-2 border-blue text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            className="mr-1 bg-[#A5D9D0] text-black w-full"
            type="submit"
            style={{ maxWidth: "100%" }} // Menyesuaikan gaya tombol agar tetap terlihat
          >
            Update Data
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default EditProfile;