import React from "react";
import { motion as Motion } from "motion/react";
import Sidebar from "./Sidebar";
import BottomAppBar from "./BottomAppBar";

export default function PageLayout({ children, title, rightActions }) {
  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden">
      <Sidebar />

      {/* Top Bar - Mobile only */}
      <Motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 md:hidden bg-white border-2 border-black px-4 py-3 flex items-center justify-between z-30 shadow-[0_4px_8px_rgba(0,0,0,1)]"
      >
        <h1 className="text-xl font-bold text-black">{title}</h1>
        <div className="flex items-center space-x-2">{rightActions}</div>
      </Motion.div>

      {/* Desktop Header */}
      <Motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="fixed top-0 left-64 right-0 hidden md:flex items-center justify-between bg-white border-2 border-black px-6 py-4 z-30 shadow-[0_4px_8px_rgba(0,0,0,1)]"
      >
        <h1 className="text-3xl font-bold text-black">{title}</h1>
        <div className="flex items-center space-x-3">{rightActions}</div>
      </Motion.div>

      {/* Main Content Area */}
      <div className="md:ml-64">
        <Motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 md:p-6 pt-20 md:pt-20 pb-20 md:pb-6 min-h-screen"
        >
          {/* Content Card */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] overflow-hidden"
          >
            {children}
          </Motion.div>
        </Motion.main>
      </div>

      <BottomAppBar />
    </div>
  );
}
