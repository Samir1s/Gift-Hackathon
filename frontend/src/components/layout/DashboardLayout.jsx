import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import ChatbotFAB from '@/components/chatbot/ChatbotFAB';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-[#0F1117] text-white overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardNavbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
            <ChatbotFAB />
        </div>
    );
};

export default DashboardLayout;
