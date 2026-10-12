import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ChatBubble from '../Components/ChatBubble';

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col justify-between relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Glass Navbar Header */}
      <Header />
      
      {/* Main Page Content */}
      <main className="flex-grow pt-[72px]">
        {children}
      </main>

      {/* Global AI Chatbot Floating Assistant */}
      <ChatBubble />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
