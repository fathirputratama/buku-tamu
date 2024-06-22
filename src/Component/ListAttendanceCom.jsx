import React, { useState, useEffect } from 'react';
import { Button } from '@material-tailwind/react';
import { BiPlus } from "react-icons/bi";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';
import { BsQrCodeScan } from "react-icons/bs";
import { Doughnut } from 'react-chartjs-2';

const ListAttendance = () => {
    const [attendances, setAttendances] = useState([]);
    const [error, setError] = useState(null);
    const { guid_event } = useParams();
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);
    const [qrCodeContent, setQRCodeContent] = useState('');
    const [attendanceStatusCount, setAttendanceStatusCount] = useState({});

    const handleDetailClick = (guid_event) => {
        setQRCodeContent('http://localhost:5173/' + guid_event);
        setShowQRCodeModal(true);
    };

    const closeQRCodeModal = () => {
        setShowQRCodeModal(false);
        setQRCodeContent('');
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

                const response = await axios.get(`https://635f-103-255-156-10.ngrok-free.app/attendance/attendanceslist/${guid_event}`, {
                    headers: headers
                });

                setAttendances(response.data);

                // Hitung jumlah masing-masing status kehadiran
                const statusCount = response.data.reduce((acc, curr) => {
                    acc[curr.status] = (acc[curr.status] || 0) + 1;
                    return acc;
                }, {});
                setAttendanceStatusCount(statusCount);
            } catch (error) {
                setError("Terjadi kesalahan dalam mengambil data. Silakan coba lagi nanti.");
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [guid_event]); // Include guid_event in dependencies to fetch data when it changes

    // Data untuk chart pie
    const data = {
        labels: Object.keys(attendanceStatusCount),
        datasets: [
            {
                label: 'Status Kehadiran',
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF' // Tambahkan warna sesuai kebutuhan
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF' // Tambahkan warna sesuai kebutuhan
                ],
                data: Object.values(attendanceStatusCount)
            }
        ]
    };

    return (
        <>
            <div className="w-8/12 my-5 bg-[#a5d9d09d] h-full rounded-lg shadow-md">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-[#1A4D2E]">List Kehadiran</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outlined"
                                size="sm"
                                className="border-[#1A4D2E] text-blue rounded-full flex justify-center hover:bg-[#1A4D2E] hover:text-white"
                                onClick={() => handleDetailClick(guid_event)}
                            >
                                <BsQrCodeScan size={18} />
                            </Button>
                            <Link to={`/addattendance/${guid_event}`}>
                                <Button
                                    className="border-[#1A4D2E] text-blue rounded-full flex justify-center hover:bg-[#1A4D2E] hover:text-white"
                                    size='sm'
                                    variant='outlined'
                                >
                                    <BiPlus size={18} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <hr className="border-green-800 my-3" />
                    {error && <div className="text-red-500 mb-3">{error}</div>}
                    <div className="mt-3">
                        <table className="w-full text-xs table-auto border-[#1A4D2E] border-collapse rounded-lg overflow-auto">
                            <thead className="bg-[#1A4D2E] text-white">
                                <tr className="border-b-2 font-bold">
                                    <td className="p-1 text-center">Nama</td>
                                    <td className="p-1 text-center">Email</td>
                                    <td className="p-1 text-center">Nomor Telepon</td>
                                    <td className="p-1 text-center">Status</td>
                                </tr>
                            </thead>
                            <tbody className="[&>:nth-child(even)]:bg-[#D9D9D9] [&>:nth-child(odd)]:bg-white">
                                {Array.isArray(attendances) && attendances.length > 0 ? (
                                    attendances.map((attendance, index) => (
                                        <tr key={index}>
                                            <td className="p-1 text-center">{attendance.name_attendance}</td>
                                            <td className="p-1 text-center">{attendance.email}</td>
                                            <td className="p-1 text-center">{attendance.phone_number}</td>
                                            <td className="p-1 text-center">{attendance.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-1 text-center">Tidak ada data kehadiran.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <div className="w-8/12 my-5">
                <Doughnut data={data} />
            </div> */}
            {showQRCodeModal && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-lg font-bold mb-4">QR Code</h2>
                        <div className="flex justify-center">
                            <QRCode value={qrCodeContent} size={256} />
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="button" className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md" onClick={closeQRCodeModal}>
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ListAttendance;
