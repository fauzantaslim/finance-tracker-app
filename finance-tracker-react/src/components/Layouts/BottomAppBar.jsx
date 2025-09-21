import React from "react";
import { useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { useLogin } from "../../hooks/useLogin";
import AddTransactionSheet from "../Fragments/AddTransactionSheet";

const bottomBarItems = [
  { label: "Dashboard", icon: "mdi:view-dashboard" },
  { label: "Categories", icon: "mdi:folder" },
  { label: "Add transaction", icon: "mdi:plus" },
  { label: "Wallets", icon: "mdi:wallet" },
  { label: "Menu", icon: "mdi:menu" },
];

const menuItems = [
  { label: "Add transaction", icon: "mdi:plus" },
  { label: "Dashboard", icon: "mdi:view-dashboard" },
  { label: "Wallets", icon: "mdi:wallet" },
  { label: "Categories", icon: "mdi:folder" },
  { label: "History", icon: "mdi:history" },
];

export default function BottomAppBar() {
  const [open, setOpen] = useState(false);
  const user = useLogin();
  const [openAdd, setOpenAdd] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-between items-center bg-white border-2 border-black px-2 py-1 shadow-[0_-4px_8px_rgba(0,0,0,1)]"
      >
        {bottomBarItems.map((item) => (
          <Motion.button
            key={item.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center text-xl py-3 px-3 hover:text-yellow-600 transition text-black"
            onClick={() => {
              if (item.label === "Menu") handleOpen();
              if (item.label === "Add transaction") setOpenAdd(true);
            }}
            title={item.label}
          >
            <Icon icon={`${item.icon}`} className="text-2xl text-yellow-600" />
          </Motion.button>
        ))}
      </Motion.nav>
      {/* Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
          >
            {/* Overlay */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40"
              onClick={handleClose}
            />
            {/* Sheet */}
            <Motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.4,
              }}
              className="relative w-full bg-white border-2 border-black rounded-t-2xl p-6 flex flex-col items-center shadow-[0_-4px_8px_rgba(0,0,0,1)]"
            >
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-12 h-1.5 bg-black rounded-full mb-4"
              />
              {/* User info */}
              <Motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="flex flex-col items-center mb-6"
              >
                <Motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-2xl font-bold text-black mb-2"
                >
                  {user.name[0]}
                </Motion.div>
                <div className="text-center mb-2">
                  <div className="font-semibold text-black">{user.name}</div>
                  <div className="text-gray-600 text-sm">{user.email}</div>
                </div>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg mt-2 transition border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  Logout
                </Motion.button>
              </Motion.div>
              {/* Menu list */}
              <Motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="w-full space-y-2 mb-4"
              >
                {menuItems.map((item, index) => (
                  <Motion.li
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  >
                    <Motion.a
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="#"
                      className="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-100 font-semibold text-black transition border-2 border-transparent hover:border-black"
                      onClick={(e) => {
                        if (item.label === "Add transaction") {
                          e.preventDefault();
                          setOpen(false);
                          setOpenAdd(true);
                        }
                      }}
                    >
                      <Motion.span
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className="text-xl mr-3"
                      >
                        <Icon
                          icon={`${item.icon}`}
                          className="text-xl mr-3 text-yellow-600"
                        />
                      </Motion.span>
                      {item.label}
                    </Motion.a>
                  </Motion.li>
                ))}
              </Motion.ul>
              <Motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </Motion.button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
      {/* Bottom sheet for Add Transaction on mobile */}
      <AddTransactionSheet
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        variant="bottom"
      />
    </>
  );
}
