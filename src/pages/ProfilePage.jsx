import React, { useState, useEffect } from 'react'; // Mengimpor React dan hook useState serta useEffect
import axios from 'axios'; // Mengimpor axios untuk melakukan permintaan HTTP
import Layout from '../Component/SidebarCom'; // Mengimpor komponen SidebarCom untuk layout
import { Card, CardBody, Avatar, Button } from "@material-tailwind/react"; // Mengimpor komponen dari Material Tailwind
import Profile from "../assets/profile.webp"; // Mengimpor gambar profil
import EditProfile from '../Component/ModalComponent/EditProfile'; // Mengimpor komponen modal untuk mengedit profil
import { TbEdit } from "react-icons/tb"; // Mengimpor ikon edit dari react-icons
import EditFotoProfile from '../Component/ModalComponent/EditFotoProfile';

const ProfilePage = () => {
  const [profiles, setProfiles] = useState(null); // Inisialisasi state profiles sebagai null
  const [modalType, setModalType] = useState(null); // Inisialisasi state modalType sebagai null
  const [isModalOpen, setIsModalOpen] = useState(false); // Inisialisasi state isModalOpen sebagai false
  const [error, setError] = useState(null); // Inisialisasi state error sebagai null

  // Menggunakan useEffect untuk mengambil data profil saat komponen pertama kali dirender
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Mendapatkan token dari localStorage
        if (!token) {
          setError("Token tidak ditemukan. Silakan login ulang."); // Menangani kesalahan jika token tidak ditemukan
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`, // Menambahkan header Authorization dengan token
          'ngrok-skip-browser-warning': 'true'
        };

        const response = await axios.get(`https://635f-103-255-156-10.ngrok-free.app/company/`, { headers }); // Mengambil data profil dari server
        console.log(response.data.data);

        setProfiles(response.data.data); // Menyimpan data profil ke state profiles
      } catch (error) {
        setError("Terjadi kesalahan dalam mengambil data. Silakan coba lagi nanti."); // Menangani kesalahan jika permintaan gagal
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Memanggil fungsi fetchData
  }, []); // Dependency array kosong untuk memastikan useEffect hanya berjalan sekali

  // Fungsi untuk membuka modal
  const handleOpenModal = (modalType = null) => {
    setModalType(modalType); // Mengatur tipe modal
    setIsModalOpen(true); // Membuka modal
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Menutup modal
  };

  // Fungsi untuk memperbarui profil
  const handleUpdateProfile = async (updatedProfileData) => {
    try {
      // Mengirim permintaan ke backend untuk memperbarui profil
      const response = await axios.put(`https://635f-103-255-156-10.ngrok-free.app/company/`, updatedProfileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Menambahkan header Authorization dengan token
        }
      });

      setProfiles(response.data.data); // Memperbarui state profiles dengan data yang diterima dari server

      setIsModalOpen(false); // Menutup modal setelah berhasil memperbarui profil
    } catch (error) {
      console.error('Error updating profile:', error); // Menangani kesalahan jika permintaan gagal
    }
  };

  return (
    <div>
      <Layout>
        <h1 className="tracking-wider pt-3">
          Dashboard / <span className="font-bold">Profile</span>
        </h1>
        <div className='relative mt-8 h-52 w-full overflow-hidden rounded-xl bg-[#4F6F52] bg-cover	bg-center'>
        </div>
        <Card className="mx-3 -mt-40 mb-6 lg:mx-4 border border-blue-gray-100">
          <CardBody className="p-4">
            <div className="flex gap-8 flex-wrap p-4 relative">
              <div className='relative'>
                <Avatar
                  src={profiles && profiles.image ? profiles.image : Profile} // Menampilkan gambar profil jika ada, jika tidak menggunakan gambar default
                  variant="rounded"
                  className="rounded-lg shadow-md w-56 h-56 shadow-blue-gray-500/40"
                />
                <TbEdit
                  className="absolute bottom-0 right-0 mb-2 mr-2 text-2xl text-gray-800 cursor-pointer rounded-full p-2 bg-[#A5D9D0] w-10 h-10"
                  onClick={() => handleOpenModal('EditFotoProfile')} // Membuka modal untuk mengedit foto profil
                />
              </div>
              <div className="flex flex-col items-center">
                <ul className="text-[#1A4D2E] text-lg space-y-4">
                  <li><strong>Nama Perusahaan : </strong>{profiles && profiles.nama}</li>
                  <li><strong>Email : </strong>{profiles && profiles.email}</li>
                  <li><strong>No Telepon : </strong>{profiles && profiles.no_telp}</li>
                  <li><strong>Alamat : </strong>{profiles && profiles.alamat}</li>
                </ul>
              </div>
              <Button 
                className="bg-[#A5D9D0] text-black w-full py-3"
                onClick={() => handleOpenModal('EditProfile')} // Membuka modal untuk mengedit profil
              >
                Edit Profile
              </Button>
            </div>
          </CardBody>
        </Card>
        {modalType === 'EditProfile' && (
          <EditProfile
            isOpen={isModalOpen} // Status modal terbuka
            onClose={handleCloseModal} // Fungsi untuk menutup modal
            onUpdateProfile={handleUpdateProfile} // Fungsi untuk memperbarui profil
            profiles={profiles} // Data profil yang akan diedit
          />
        )}
        {modalType === 'EditFotoProfile' && (
          <EditFotoProfile
            isOpen={isModalOpen} // Status modal terbuka
            onClose={handleCloseModal} // Fungsi untuk menutup modal
            onUpdateProfile={handleUpdateProfile} // Fungsi untuk memperbarui foto profil
            profiles={profiles} // Data profil yang akan diedit
          />
        )}
      </Layout>
    </div>
  );
}

export default ProfilePage; // Mengekspor komponen ProfilePage
