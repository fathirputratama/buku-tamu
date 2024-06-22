import React, { useState, useEffect } from 'react';
import Layout from '../Component/SidebarCom';
import dashboard from '../assets/SVG.svg';
import axios from 'axios';
import CountEventCom from "../Component/CountEventCom";

const DashboardPage = () => {
  // const [eventsToday, setEventsToday] = useState([]);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchEventsToday = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
  //       if (!token) {
  //         setError("Token tidak ditemukan. Silakan login ulang.");
  //         return;
  //       }

  //       const headers = {
  //         'Authorization': `Bearer ${token}`,
  //         'ngrok-skip-browser-warning': 'true'
  //       };

  //       const response = await axios.get('https://8b17-182-253-158-42.ngrok-free.app/event/events', {
  //         headers: headers
  //       });

  //       if (response.data.status && Array.isArray(response.data.events)) {
  //         const today = new Date().toISOString().split('T')[0]; // Today's date in ISO format
  //         const eventsToday = response.data.events.filter(event => typeof event.timestamp === 'string' && event.timestamp.split('T')[0] === today);
  //         setEventsToday(eventsToday);
  //       } else {
  //         setError("Data yang diterima tidak valid");
  //       }
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //   };

  //   fetchEventsToday();
  // }, []);

  return (
    <Layout>
      <h1 className="tracking-wider py-5 font-bold">
        Dashboard <span className='font-medium'> /</span>
      </h1>
      <div className='w-full h-80 rounded-lg shadow-md bg-[#bddece] flex items-center justify-center'>
        <div className='flex flex-col gap-2 px-11'>
          <h1 className='text-[#1A4D2E] text-xl font-semibold mb-3'>Selamat Datang !</h1>
          <p className='text-[#1A4D2E] text-sm font-normal mb-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <img src={dashboard} alt="" className='px-11' style={{ margin: '0 20px' }} />
      </div>
        <CountEventCom />
    </Layout>
  );
}

export default DashboardPage;
