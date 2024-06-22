import { useState, useEffect } from "react";
import Layout from "../Component/SidebarCom.jsx";
import { Button } from "@material-tailwind/react";
import { BiCalendar, BiPlus } from "react-icons/bi";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import TambahAttendance from "./ModalComponent/TambahAttendance.jsx";
import axios from 'axios';
import { useParams } from "react-router-dom";
import ListAttendance from "./ListAttendanceCom.jsx";
import { MdDateRange, MdOutlineLocationOn, MdOutlineSpeakerNotes } from "react-icons/md";


const currentDate = new Date();
const options = { year: "numeric", month: "long", day: "numeric" };
const formattedDate = currentDate.toLocaleDateString("id-ID", options);

const DetailEventCom = () => {
    const [events, setEvents] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const { guid_event } = useParams();

    const handleOpenModal = (modalType) => {
      setModalType(modalType);
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
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

          const response = await axios.get(`https://635f-103-255-156-10.ngrok-free.app/event/${guid_event}`, {
            headers: headers
          });

          setEvents(response.data.event)
        } catch (error) {
          setError("Terjadi kesalahan dalam mengambil data. Silakan coba lagi nanti.");
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [guid_event]);

    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const formattedDate = date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
      return `${formattedTime}, ${formattedDate}`;
    };

  return (
    <div>
      <Layout>
        <h1 className="tracking-wider">
          Dashboard / Jadwal Event / <span className="font-bold">Detail Event</span>
        </h1>
        <div className="mt-3 flex gap-3">
          <div className="flex justify-start items-center gap-3 text-blue mr-5">
            <BiCalendar size={20} />
            <div>{formattedDate}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="block rounded-lg my-5 w-4/12 bg-[#a5d9d0] text-left shadow-md dark:bg-surface-dark dark:text-black text-surface">
            <div className="border-b-2 border-neutral-100 px-6 py-3  text-center font-bold dark:border-white/10">
              {events.name}
            </div>
            <div className="p-6">
              <div className="w-full max-w-[18rem] rounded-lg bg-white shadow-secondary-1 dark:bg-surface-dark dark:text-white">
                <div className="border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-white/10">
                  <span className="flex items-center gap-3">
                      <MdDateRange  size={20}/>
                      {formatTimestamp(events.timestamp)}
                  </span>
                </div>
                <ul className="w-full">
                  <li className="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 flex items-center dark:border-white/10 gap-3">
                    <MdOutlineLocationOn size={20}/>
                    {events.location}
                  </li>
                  <li className="w-full border-b-2 border-neutral-100 border-opacity-100 px-4 py-3 flex items-center dark:border-white/10 gap-3">
                    <MdOutlineSpeakerNotes size={20}/>
                    {events.notes}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ListAttendance />
        </div>
        {modalType === 'TambahAttendance' && (
          <TambahAttendance
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </Layout>
    </div>
  );
}

export default DetailEventCom;
