import { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import background from "../assets/background.jpg";
import { MdOutlinePassword } from "react-icons/md";
import { BsPersonFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMdCall } from "react-icons/io";
import axios from "axios";
import Swal from 'sweetalert2'; // Import SweetAlert

const RegisterPage = () => {
  const [nama, setNama] = useState('');
  const [alamat, setAlamat] = useState('');
  const [email, setEmail] = useState('');
  const [no_telp, setNoTelp] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://635f-103-255-156-10.ngrok-free.app/company/addcompany', { nama, alamat, email, no_telp, password })
      .then(response => {
        console.log(response);
        navigate('/');
      })
      .catch(err => {
        console.error(err);
        // Menggunakan SweetAlert untuk menampilkan pesan kesalahan
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Email sudah digunakan. Silakan gunakan email lain.',
        });
      });
  };

  return (
    <>
      <div style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="flex justify-end items-center h-screen overflow-hidden text-white px-20">
          <div className="flex flex-col gap-6 p-12 rounded-2xl"
            style={{
              backgroundColor: 'rgba(131, 119, 119, 0.1)',
              backgroundImage: 'linear-gradient(126deg, rgba(240, 232, 232, 0.5) 0%, rgba(70, 119, 107, 0.5) 79%)',
            }}
          >
            <h1 className="text-2xl text-center font-bold">Create Account</h1>
            <p className="text-center">Silakan masukkan email dan kata sandi yang benar</p>
            
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                color="white"
                icon={<BsPersonFill className="text-white" />}
                className="text-white shadow-lgring-4 ring-transparent p-3 rounded-lg bg-transparent mb-4"
                label="Nama Lengkap"
                onChange={(e) => setNama(e.target.value)}
              />
              
              <Input
                type="text"
                color="white"
                icon={<FaMapLocationDot className="text-white" />}
                className="text-white shadow-lgring-4 ring-transparent p-3 rounded-lg bg-transparent mb-4"
                label="Alamat"
                onChange={(e) => setAlamat(e.target.value)}
              />
              
              <Input
                type="email"
                color="white"
                icon={<MdEmail className="text-white" />}
                className="text-white shadow-lgring-4 ring-transparent p-3 rounded-lg bg-transparent mb-4"
                label="E-mail"
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <Input
                type="text"
                color="white"
                icon={<IoMdCall className="text-white" />}
                className="text-white shadow-lgring-4 ring-transparent p-3 rounded-lg bg-transparent mb-4"
                label="Nomor Telepon"
                onChange={(e) => setNoTelp(e.target.value)}
              />
              
              <Input
                type="password"
                color="white"
                icon={<MdOutlinePassword className="text-white" />}
                className="text-white shadow-lgring-4 ring-transparent p-3 rounded-lg bg-transparent mb-4"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <Button className="bg-[#A5D9D0] text-black w-full py-3" type="submit">Register</Button>
            </form>
            
            <div className="flex justify-center text-center">
              <div className="text-sm">Sudah punya akun?<Link to="/" className="font-semibold"> Login </Link>di sini!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
