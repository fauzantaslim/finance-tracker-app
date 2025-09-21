"use client";

import { useState } from "react";
import { motion as Motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import AddTransactionSheet from "../fragments/AddTransactionSheet";

const bottomBarItems = [
  { label: "Dashboard", icon: "mdi:view-dashboard", path: "/dashboard" },
  { label: "Categories", icon: "mdi:folder", path: "/dashboard/categories" },
  { label: "Add transaction", icon: "mdi:plus", path: null },
  { label: "Wallets", icon: "mdi:wallet", path: "/dashboard/wallets" },
  { label: "Menu", icon: "mdi:menu", path: null }
];

const menuItems = [
  { label: "Add transaction", icon: "mdi:plus", path: null },
  { label: "Dashboard", icon: "mdi:view-dashboard", path: "/dashboard" },
  { label: "Wallets", icon: "mdi:wallet", path: "/dashboard/wallets" },
  { label: "Categories", icon: "mdi:folder", path: "/dashboard/categories" },
  { label: "History", icon: "mdi:history", path: "/dashboard/history" },
];

export default function BottomAppBar() {
  const [openAdd, setOpenAdd] = useState(false);
  const router = useRouter();

  // Mock user data - would come from authentication context in a real app
  const user = {
    name: "User",
    email: "user@example.com",
  };

  return (
    <>
      {/* Menu Sheet */}
      <Sheet>
        <Motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden justify-between items-center bg-white border-2 border-black px-2 py-1 shadow-[0_-4px_8px_rgba(0,0,0,1)]"
        >
          {bottomBarItems.map((item) => {
            if (item.label === "Menu") {
              return (
                <SheetTrigger key={item.label} asChild>
                  <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center text-xl py-3 px-3 hover:text-yellow-600 transition text-black"
                    title={item.label}
                  >
                    <Icon icon={`${item.icon}`} className="text-2xl text-yellow-600" />
                  </Motion.button>
                </SheetTrigger>
              );
            }
            
            return (
              <Motion.button
                key={item.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center text-xl py-3 px-3 hover:text-yellow-600 transition text-black"
                onClick={() => {
                  if (item.label === "Add transaction") setOpenAdd(true);
                  else if (item.path) router.push(item.path);
                }}
                title={item.label}
              >
                <Icon icon={`${item.icon}`} className="text-2xl text-yellow-600" />
              </Motion.button>
            );
          })}
        </Motion.nav>
        <SheetContent side="bottom" className="h-auto">
          <div className="w-12 h-1.5 bg-black rounded-full mx-auto mb-4" />
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          {/* User info */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-2xl font-bold text-black mb-2">
              {user.name[0]}
            </div>
            <div className="text-center mb-2">
              <div className="font-semibold text-black">{user.name}</div>
              <div className="text-gray-600 text-sm">{user.email}</div>
            </div>
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg mt-2 transition border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              onClick={() => {
                router.push("/login");
              }}
            >
              Logout
            </button>
          </div>
          
          {/* Menu list */}
          <ul className="w-full space-y-2 mb-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-yellow-100 font-semibold text-black transition border-2 border-transparent hover:border-black"
                  onClick={() => {
                    if (item.label === "Add transaction") {
                      setOpenAdd(true);
                    } else if (item.path) {
                      router.push(item.path);
                    }
                  }}
                >
                  <Icon
                    icon={`${item.icon}`}
                    className="text-xl mr-3 text-yellow-600"
                  />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
      {/* Bottom sheet for Add Transaction on mobile */}
      <AddTransactionSheet
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        variant="bottom"
      />
    </>
  );
}
