import React, { createContext, useContext, useState } from "react";
import { LayoutDashboard, Calendar } from "lucide-react";
import { LuUserCircle, LuLogOut, LuClipboardList, LuAlignJustify } from "react-icons/lu";
import profile from "../assets/profile.webp";
import { Navigate, NavLink } from "react-router-dom";
import { useAuth } from '../routers/utils/AuthContext';
import Swal from 'sweetalert2';

const SidebarContext = createContext();

function SidebarItem({ icon, text, to, active, alert, onClick }) {
    const { expanded } = useContext(SidebarContext);

    return (
        <li
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
                active ? "bg-[#CDFADB] text-[#1E5128]-200" : "hover:bg-[#CDFADB] text-[#1A4D2E]"
            }`}
            onClick={onClick}
        >
            {icon}
            <NavLink 
                to={to}
                className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`} 
            >
                {text}
            </NavLink>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />
            )}
            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-[#519872] text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </li>
    );
}

const Layout = ({ children, profileImage }) => {
    const [expanded, setExpanded] = useState(true);
    const [activeItem, setActiveItem] = useState("router");
    const { auth, logout } = useAuth();

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    // Fungsi logout dengan konfirmasi menggunakan SweetAlert2
    const handleLogout = () => {
        Swal.fire({
            title: 'Logout',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Logout',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // Logout jika pengguna menekan tombol Ya
            }
        });
    };

    return (
        <div className="flex">
            <nav className="w-full z-40 bg-white fixed shadow-gray-200 shadow-sm top-0 h-12">
                <div className="px-4 flex justify-between items-center">
                    <div className="flex justify-between px-4 py-3">
                        <h1 className="font-semibold text-[#1A4D2E] text-xl">Website Admin</h1>
                        <button onClick={() => setExpanded((curr) => !curr)} className={`ml-3 px-4 rounded-lg text-[#1A4D2E] bg-gray-50 hover:bg-gray-100 ${activeItem === "router" ? "bg-gray-100" : ""}`}>
                            <LuAlignJustify />
                        </button>
                    </div>
                    {profileImage && <img src={profileImage} className="float-end w-9 h-9 rounded-full" />}                
                </div>
            </nav>
            <aside className={`fixed h-screen shadow-xl z-30 transition-all pt-8 ${expanded ? "w-60" : "w-[73px]"}`}>
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-1 px-3 mr-2 mt-7">
                            <SidebarItem
                                icon={<LayoutDashboard size={20} />}
                                text="Dashboard"
                                to="/dashboard"
                                active={activeItem === "Dashboard"}
                                onClick={() => handleItemClick("Dashboard")}
                            />
                            <SidebarItem
                                icon={<Calendar size={20} />}
                                text="Event"
                                to={`/event`}
                                active={activeItem === "Event"}
                                onClick={() => handleItemClick("Event")}
                            />
                        </ul>

                        <ul className="px-3 mr-2 pb-4">
                            <SidebarItem
                                icon={<LuUserCircle size={20} />}
                                text="Profile"
                                to="/profile"
                                active={activeItem === "Profile"}
                                onClick={() => handleItemClick("Profile")}
                            />
                            <hr className="my-3" />
                            <SidebarItem
                                icon={<LuLogOut size={20} />}
                                text="Logout"
                                to="#"
                                active={activeItem === "Logout"}
                                onClick={handleLogout}
                            />
                        </ul>
                    </SidebarContext.Provider>
                </nav>
            </aside>
            <main className="flex-1 p-8 pt-16 pl-28">
                {children}
            </main>
        </div>
    );
}

export default Layout;
