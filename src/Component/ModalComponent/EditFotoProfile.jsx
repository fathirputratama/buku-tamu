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
const EditFotoProfile = ({ isOpen, onClose, profiles, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    image: ""
  });

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (profiles) {
      setFormData({
        image: profiles.image
      });
    }
  }, [profiles]);

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
      size="xs" // Ubah ukuran modal menjadi kecil (small)
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
            Edit Foto Profile
          </h1>
          <div className="flex flex-col gap-2 p-4">
            <div className="flex flex-col">
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

export default EditFotoProfile;