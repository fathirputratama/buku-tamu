import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { BiCalendar, BiPlus } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { CgDetailsMore } from "react-icons/cg";
import { MdOutlineEvent } from "react-icons/md";
import { FaEllipsisV } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import EditEvent from "../Component/ModalComponent/EditEvent.jsx";
import TambahEvent from "../Component/ModalComponent/TambahEvent.jsx";
import Layout from "../Component/SidebarCom.jsx";
import Swal from 'sweetalert2';
import { MdDateRange, MdOutlineLocationOn, MdOutlineSpeakerNotes } from "react-icons/md";

const currentDate = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };
const formattedDate = currentDate.toLocaleDateString("id-ID", options);

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null);

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
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

        if (response.data.status && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
          filterTodayEvents(response.data.events);
        } else {
          setError("Data yang diterima tidak valid");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setTimeout(fetchData, 60000); // Fetch data every 1 minute
      }
    };

    fetchData(); // Call fetchData initially

    return () => clearTimeout();
  }, []);

  const filterTodayEvents = (events) => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startOfDay && eventDate <= endOfDay;
    });

    setTodayEvents(filteredEvents);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formattedDate = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${formattedTime}, ${formattedDate}`;
  };

  const handleOpenModal = (modalType, event = null) => {
    if (modalType === 'DetailEvent') {
      setSelectedDetailEvent(event);
    } else {
      setModalType(modalType);
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleAddEvent = async (newEvent) => {
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

      const response = await axios.post('https://635f-103-255-156-10.ngrok-free.app/event/events', newEvent, {
        headers: headers
      });

      if (response.status === 201) {
        setEvents([...events, response.data.event]);
        filterTodayEvents([...events, response.data.event]);
        Swal.fire(
          'Success!',
          'Acara berhasil ditambahkan.',
          'success'
        );
      } else {
        Swal.fire(
          'Failed!',
          'Gagal menambahkan acara. Silakan coba lagi.',
          'error'
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire(
        'Error!',
        'Terjadi kesalahan. Silakan coba lagi.',
        'error'
      );
    }
  };

  const handleUpdateEvent = (updatedEvent) => {
    const updatedEvents = events.map(event => (event.guid_event === updatedEvent.guid_event ? updatedEvent : event));
    setEvents(updatedEvents);
    filterTodayEvents(updatedEvents);
  };

  const handleDeleteEvent = async (guidEvent) => {
    const userConfirmed = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!'
    });

    if (userConfirmed.isConfirmed) {
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

        const response = await axios.delete(`https://635f-103-255-156-10.ngrok-free.app/event/events/${guidEvent}`, {
          headers: headers
        });

        if (response.status === 200) {
          Swal.fire(
            'Deleted!',
            'Acara telah berhasil dihapus.',
            'success'
          );
          const updatedEvents = events.filter(event => event.guid_event !== guidEvent);
          setEvents(updatedEvents);
          filterTodayEvents(updatedEvents);
        } else {
          Swal.fire(
            'Failed!',
            'Gagal menghapus acara. Silakan coba lagi.',
            'error'
          );
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire(
          'Error!',
          'Terjadi kesalahan. Silakan coba lagi.',
          'error'
        );
      }
    }
  };

  return (
    <>
      <Layout>
        {/* <div className="event-container">
          <div className="event-list w-2/3"> */}
            <h1 className="tracking-wider py-5">
              Dashboard / <span className="font-bold">Jadwal Event</span>
            </h1>
            <div className="flex gap-3">
              <div className="flex justify-start items-center gap-3 text-blue mr-5">
                <BiCalendar size={20} />
                <div>{formattedDate}</div>
              </div>
              <div className="flex flex-col justify-center items-center text-[10px]">
                <Button
                  variant="outlined"
                  size="sm"
                  className="bg-[#1A4D2E] text-white rounded-2xl min-w-20 flex justify-center"
                  onClick={() => handleOpenModal('TambahEvent')}
                >
                  <BiPlus size={18} />
                </Button>
                Tambah Kegiatan
              </div>
            </div>
            <div className="my-5">
              <h2>Jadwal Terdaftar</h2>
              <div className="py-3">
                {events.map((event, index) => (
                  <div key={index} className="py-1 relative">
                    <ul className="bg-[#135D66] transition-all duration-500 p-5 flex items-center rounded-3xl gap-4 hover:bg-[#6295A2] relative">
                      <div className="bg-[#A5D9D0] rounded-full p-2">
                        <MdOutlineEvent size={28} className="text-[#135D66]" />
                      </div>
                      <div className="flex flex-col">
                        <li name="name" className="text-white group-hover:text-black">{event.name}</li>
                        <li name="timestamp" className="text-white group-hover:text-black">{formatTimestamp(event.timestamp)}</li>
                        <li name="location" className="text-white group-hover:text-black">{event.location}</li>
                      </div>
                      <div className="absolute top-2 right-4">
                        <button
                          onClick={() => toggleMenu(index)}
                          className="p-2 rounded-full hover:bg-[#A5D9D0]"
                        >
                          <FaEllipsisV size={18} className="text-white hover:text-[#135D66]" />
                        </button>
                        {menuOpen === index && (
                          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-10">
                            <div className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="space-y-2">
                                  <Button
                                    size="sm"
                                    variant="text"
                                    className="flex w-48 gap-3 text-[#A91D3A] text-xs px-12 p-2 bg-[#ff5275bb] hover:bg-[#FFCAD4]"
                                    onClick={() => handleDeleteEvent(event.guid_event)}
                                  >
                                    <RiDeleteBin6Fill size={14} className="text-[#A91D3A]" />
                                    delete
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="text"
                                    className="flex w-48 gap-3 text-[#d18437] text-xs px-12 p-2 bg-[#ffec82] hover:bg-[#FFFC9B]"
                                    onClick={() => handleOpenModal('EditEvent', event)}
                                  >
                                    <FiEdit3 size={14} className="text-[#d18437]" />
                                    edit
                                  </Button>
                                  <Link
                                    to={`/detailevent/${event.guid_event}`}
                                    className="block"
                                    onClick={() => handleOpenModal('DetailEvent', event)}
                                  >
                                    <Button
                                      size="sm"
                                      variant="text"
                                      className="flex w-48 gap-3 text-xs px-12 p-2 bg-[#A5D9D0] hover:bg-[#a5d9d09d]"
                                    >
                                      <CgDetailsMore size={14} className="text-black" />
                                      detail
                                    </Button>
                                  </Link>

                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ul>                
                  </div>
                ))}
              </div>
            </div>
      </Layout>
      {/* Modal tambah event */}
      {modalType === 'TambahEvent' && (
        <TambahEvent
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddEvent={handleAddEvent}
        />
      )}
      {/* Modal edit event */}
      {modalType === 'EditEvent' && selectedEvent && (
        <EditEvent
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          onUpdateEvent={handleUpdateEvent}
        />
      )}
    </>
  );
};

export default EventPage;
