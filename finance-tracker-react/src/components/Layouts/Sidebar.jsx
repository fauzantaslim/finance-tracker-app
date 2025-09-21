import React from "react";
import { motion as Motion } from "motion/react";
import { Icon } from "@iconify/react";
import { useLogin } from "../../hooks/useLogin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { clearAuth } from "../../redux/slices/authSlice";
import { refreshAccessToken } from "../../services/auth.service";
import { setAccessToken } from "../../redux/slices/authSlice";
import { useState } from "react";
import AddTransactionSheet from "../Fragments/AddTransactionSheet";

const menuItems = [
  { label: "Add transaction", icon: "mdi:plus" },
  { label: "Dashboard", icon: "mdi:view-dashboard" },
  { label: "Wallets", icon: "mdi:wallet" },
  { label: "Categories", icon: "mdi:folder" },
  { label: "History", icon: "mdi:history" },
];

export default function Sidebar() {
  const user = useLogin();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const handleLogout = async () => {
    if (!accessToken) return;
    setIsLoggingOut(true);
    try {
      await logoutUser(accessToken);
      dispatch(clearAuth());
      navigate("/");
    } catch (e) {
      // Cek jika error 401, coba refresh token
      const err = e;
      if (err?.response?.status === 401) {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            dispatch(setAccessToken(newToken));
            await logoutUser(newToken);
            dispatch(clearAuth());
            navigate("/");
            return;
          }
        } catch {
          // refresh gagal
        }
      }
      alert("Logout gagal. Silakan coba lagi.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <>
      <Motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed left-0 top-0 hidden md:flex flex-col w-64 h-screen bg-white border-2 border-black  p-4 z-40"
      >
        <Motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col items-center mb-10 mt-2"
        >
          <Motion.svg
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="w-40 h-auto mb-2"
            viewBox="0 0 819 274"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ background: "transparent" }}
          >
            <rect x="0" y="0" width="819" height="274" fill="#ca8a04" />
            <g transform="translate(0,274) scale(0.1,-0.1)">
              <path
                fill="#fff"
                d="M0 1370 l0 -1370 4095 0 4095 0 0 1370 0 1370 -4095 0 -4095 0 0
-1370z m1347 1091 c506 -126 845 -633 772 -1157 -55 -398 -327 -732 -696 -853
-169 -56 -409 -65 -575 -22 -289 75 -520 257 -656 519 -94 181 -129 341 -119
546 13 277 121 520 315 708 155 150 344 246 547 278 96 14 318 4 412 -19z
m1808 -617 c161 -41 290 -177 330 -345 42 -179 -2 -358 -115 -469 -155 -153
-413 -184 -591 -72 -261 166 -291 576 -58 786 113 102 281 140 434 100z m2394
1 c165 -39 293 -164 337 -330 20 -75 18 -221 -5 -294 -80 -257 -364 -392 -630
-300 -253 87 -371 413 -246 676 94 200 317 301 544 248z m2206 0 c84 -22 140
-52 202 -109 62 -56 98 -113 123 -194 70 -225 1 -450 -175 -566 -227 -151
-535 -94 -676 125 -98 153 -97 402 2 552 107 161 329 242 524 192z m-3885
-469 l0 -464 -70 -4 -70 -3 0 468 0 467 70 0 70 0 0 -464z m400 252 l1 -213
207 213 207 212 89 0 88 0 -113 -120 c-63 -66 -155 -164 -205 -218 l-91 -97
198 -220 c110 -121 209 -232 220 -247 l20 -28 -90 0 -90 0 -162 183 c-89 100
-170 191 -181 202 -18 20 -19 19 -58 -25 l-39 -45 -1 -157 0 -158 -70 0 -70 0
0 465 0 465 70 0 70 0 0 -212z m2083 115 c40 -54 149 -201 242 -328 92 -126
173 -235 179 -242 8 -9 10 81 8 327 l-3 340 76 0 76 0 -3 -465 -3 -466 -69 3
-70 3 -250 342 -251 341 -3 -344 -2 -344 -70 0 -70 0 -2 465 -3 465 72 0 72 0
74 -97z"
              />
              <path
                fill="#fff"
                d="M926 2374 c-362 -71 -638 -337 -728 -700 -17 -70 -22 -118 -22 -229
0 -170 22 -271 89 -413 96 -202 234 -343 430 -439 l90 -44 3 346 2 345 24 0
c13 0 38 3 55 6 l31 7 0 -366 0 -365 28 -6 c15 -3 46 -8 70 -11 l42 -7 0 531
0 531 55 0 55 0 -2 -527 -2 -528 45 2 c24 2 59 5 77 8 l32 6 0 519 0 520 53 0
52 0 -1 -505 -1 -506 21 7 c50 15 177 88 241 139 173 136 294 333 340 550 25
117 23 306 -4 418 -87 361 -365 636 -716 708 -106 22 -258 23 -359 3z m704
-409 l0 -55 -535 0 -535 0 0 55 0 55 535 0 535 0 0 -55z m-77 -205 c102 -38
161 -124 161 -236 0 -62 -3 -78 -30 -120 -17 -29 -48 -60 -74 -76 -45 -27
-127 -52 -133 -39 -2 3 1 29 5 57 8 47 12 52 39 58 70 14 111 116 73 185 -25
45 -62 71 -115 82 -24 4 -169 8 -321 9 l-277 0 24 -42 c66 -119 30 -250 -85
-313 -70 -37 -153 -41 -215 -8 -197 104 -172 372 42 449 29 10 130 13 445 14
383 0 410 -1 461 -20z"
              />
              <path
                fill="#fff"
                d="M675 1663 c-88 -24 -123 -142 -64 -217 47 -60 161 -56 199 7 35 57
22 145 -28 190 -21 19 -74 29 -107 20z"
              />
              <path
                fill="#fff"
                d="M2923 1712 c-145 -52 -219 -180 -211 -367 5 -109 36 -184 100 -239
166 -142 412 -99 502 88 69 141 48 327 -49 434 -79 88 -228 125 -342 84z"
              />
              <path
                fill="#fff"
                d="M5313 1712 c-96 -34 -164 -107 -198 -210 -24 -73 -17 -228 12 -294
27 -60 94 -127 158 -158 74 -35 198 -35 275 1 73 34 120 76 152 136 101 190
31 435 -147 514 -69 31 -182 36 -252 11z"
              />
              <path
                fill="#fff"
                d="M7520 1713 c-91 -32 -154 -92 -197 -188 -13 -30 -17 -68 -18 -150 0
-98 3 -116 26 -165 33 -70 89 -126 159 -159 46 -22 69 -26 140 -26 102 0 155
21 229 90 76 71 96 126 96 261 0 107 -1 113 -35 180 -58 114 -161 175 -294
174 -34 -1 -81 -8 -106 -17z"
              />
            </g>
          </Motion.svg>
        </Motion.div>
        <Motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex-1"
        >
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <Motion.li
                key={item.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
              >
                <Motion.a
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="#"
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-yellow-100 font-semibold text-black transition border-2 border-transparent hover:border-black"
                  onClick={(e) => {
                    if (item.label === "Add transaction") {
                      e.preventDefault();
                      setOpenAdd(true);
                    }
                  }}
                >
                  <Motion.span
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-xl mr-3"
                  >
                    <Icon
                      icon={item.icon}
                      className="text-xl mr-3 text-yellow-600"
                    />
                  </Motion.span>
                  {item.label}
                </Motion.a>
              </Motion.li>
            ))}
          </ul>
        </Motion.nav>
        {/* User info & Logout */}
        <Motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="mt-8 pt-6 border-t-2 border-black flex flex-col items-center"
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
            className="w-full bg-yellow-400 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg mt-2 transition border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Motion.button>
        </Motion.div>
      </Motion.aside>
      {/* Right sheet for Add Transaction */}
      <AddTransactionSheet
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        variant="right"
      />
    </>
  );
}
