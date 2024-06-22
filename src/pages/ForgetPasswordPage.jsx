import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import background from "../assets/background.jpg";
import axios from "axios";
import { useAuth } from '../routers/utils/AuthContext';
import Swal from 'sweetalert2';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://635f-103-255-156-10.ngrok-free.app/company/resetpassword', { email, newPassword })
      .then(result => {
        console.log(result);
        const { data } = result;
        if (data.token) {
          localStorage.setItem('token', data.token);
          login(data.token);
          navigate('/'); // Navigasi ke dashboard setelah berhasil login
          // Tampilkan SweetAlert2 untuk konfirmasi login berhasil
          Swal.fire({
            icon: 'success',
            title: 'Password Berhasil Diperbaharui!',
            text: 'Anda berhasil Memperbaharui Password',
            showConfirmButton: false,
            timer: 1500
          });
        }
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 403 && err.response.data.message === "Account not activated") {
          // Tampilkan SweetAlert2 untuk konfirmasi bahwa akun belum diaktifkan
          Swal.fire({
            icon: 'error',
            title: 'Gagal Memperbaharui Password',
            text: 'Silahkan coba lagi',
            showConfirmButton: true,
          });
        } else {
          // Tampilkan pesan kesalahan umum
          alert('Terjadi kesalahan. Silakan coba lagi.');
        }
      });      
  }

  return (
    <>
      <div style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div className="flex justify-end items-center h-screen overflow-hidden text-white px-20">
          <div className="flex flex-col gap-3 p-12 rounded-2xl"
            style={{
              backgroundColor: 'rgba(131, 119, 119, 0.1)',
              backgroundImage: 'linear-gradient(126deg, rgba(240, 232, 232, 0.5) 0%, rgba(70, 119, 107, 0.5) 79%)'
            }}
          >
            <h1 className="text-2xl text-center font-bold">Forget Password</h1>
            <p className="text-center">Silakan masukkan email dan kata sandi yang baru</p>
            
            <form onSubmit={handleSubmit}>
              <label className="text-sm font-bold">Email</label>
              <Input
                name="email"
                type="email"
                color="white"
                className="!border !border-white text-white shadow-lgring-4 ring-transparent placeholder:text-white-700 focus:!border-white focus:!border-2 p-3 rounded-lg bg-transparent"
                labelProps={{ className: "hidden" }}
                placeholder="Masukkan email Anda"
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <label className="text-sm font-bold">New Password</label>
              <Input
                name="password"
                type="text"
                color="white"
                className="!border !border-white text-white shadow-lgring-4 ring-transparent placeholder:text-white-700 focus:!border-white focus:!border-2 p-3 rounded-lg bg-transparent"
                labelProps={{ className: "hidden" }}
                placeholder="Masukkan kata sandi Anda"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              
              <Link to={"#"} className="text-end">
                <button className="text-end text-sm">Lupa Kata Sandi?</button>
              </Link>
              
              <Button className="bg-[#A5D9D0] text-black w-full py-3" type="submit">Login</Button>
            </form>
            
            <div className="flex justify-center text-center">
              <div className="text-sm">belum punya akun?<Link to="/register" className="font-semibold"> Buat akun </Link>di sini!</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgetPasswordPage;
