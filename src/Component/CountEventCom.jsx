import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(`/event/detail/${event.guid_event}`);
    };
  
    return (
      <div 
        className='border border-gray-300 p-4 my-4 rounded-md cursor-pointer' 
        style={{ backgroundColor: '#4F6F52' }}
        onClick={handleClick}
      >
        <h2 className='text-lg text-white'>{event.name}</h2>
        <p className='text-sm text-white'>{new Date(event.timestamp).toLocaleTimeString()}</p>
      </div>
    );
}

const CountEventCom = () => {
    const [eventsToday, setEventsToday] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEventsToday = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError("Token tidak ditemukan. Silakan login ulang.");
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                };

                const response = await axios.get('https://635f-103-255-156-10.ngrok-free.app/event/events', {
                    headers: headers
                });

                console.log('API Response:', response.data);

                if (response.data.status && Array.isArray(response.data.events)) {
                    const today = new Date().toISOString().split('T')[0]; // Today's date in ISO format
                    console.log('Today:', today);

                    const eventsToday = response.data.events.filter(event => {
                        if (typeof event.timestamp === 'number') {
                            const eventDate = new Date(event.timestamp).toISOString().split('T')[0];
                            console.log(`Event Name: ${event.name}, Event Timestamp: ${event.timestamp}, Event Date: ${eventDate}, Today: ${today}`);
                            return eventDate === today;
                        } else {
                            console.log(`Invalid timestamp type for event: ${event.name}, Timestamp: ${event.timestamp}`);
                            return false;
                        }
                    });

                    console.log('Filtered Events Today:', eventsToday);

                    setEventsToday(eventsToday);
                } else {
                    setError("Data yang diterima tidak valid");
                    console.log("Invalid data structure:", response.data);
                }
            } catch (error) {
                setError("Terjadi kesalahan dalam mengambil data. Silakan coba lagi nanti.");
                console.error("Error fetching events:", error);
            }
        };

        fetchEventsToday();
    }, []);

    return (
        <div className='p-4 w-full mt-5 rounded-lg bg-[#bddece] shadow-md'>
            <h1 className='text-[#1A4D2E] text-xl font-semibold text-center'>Event Hari Ini</h1>
            {error && <p className='text-red-500'>{error}</p>}
            {eventsToday.length > 0 ? (
                eventsToday.map(event => (
                    <EventCard key={event.guid_event} event={event} />
                ))
            ) : (
                <p className='text-gray-600'>Tidak ada event hari ini.</p>
            )}
        </div>
    );
}

export default CountEventCom;
