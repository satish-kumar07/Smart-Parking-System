import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, logout } from "../firebase";
import { ChevronDown, Menu, X, Car } from "lucide-react";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Technology", href: "/technology" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Use Cases", href: "/usecases" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <header
        className="text-white h-16 backdrop-blur md:h-16 px-6 sticky top-0 z-50 shadow-md"
        style={{ fontFamily: "Instrument Sans, Inter, system-ui, sans-serif" }}
      >
        <div className="w-full mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00D4AA] to-[#00B4E5] rounded-lg flex items-center justify-center">
              <Car size={20} className="text-white" />
            </div>
            <span className="text-white font-semibold text-lg">
              Smart Parking EV
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group flex items-center space-x-1 text-white opacity-90 hover:opacity-100 hover:text-[#00D4AA] transition-colors duration-150 font-medium text-base focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] rounded-lg px-2 py-1"
              >
                <span>{item.name}</span>
                {item.name !== "Contact" && (
                  <ChevronDown
                    size={12}
                    className="transition-transform duration-150 group-hover:rotate-180"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4 ">
            {user ? (
              <div className="flex flex-row items-center gap-4">
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] flex flex-row items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                    boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                  }}
                >
                  <FaRegUserCircle size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] flex flex-row items-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                    boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                  }}
                >
                  {" "}
                  <IoMdLogIn size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/profile"
                className="px-4 py-2 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] flex flex-row"
                style={{
                  background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                  boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                }}
              >
                <IoMdLogIn size={18} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-[#0A0A0B] z-50 flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-14 px-6 border-b border-[#333333]">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00D4AA] to-[#00B4E5] rounded-lg flex items-center justify-center">
                  <Car size={20} className="text-white" />
                </div>
                <span className="text-white font-semibold text-lg">
                  Smart Parking EV
                </span>
              </div>
              <button
                className="p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-6 py-6 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center justify-between py-3 text-white opacity-90 hover:opacity-100 hover:text-[#00D4AA] transition-colors duration-150 font-medium text-base border-b border-[#333333] last:border-b-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{item.name}</span>
                  {item.name !== "Contact" && <ChevronDown size={12} />}
                </Link>
              ))}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="px-6 py-6 space-y-3 border-t border-[#333333]">
              {user ? (
                <Link
                  to="/profile"
                  className="px-8 py-4 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
                  style={{
                    background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                    boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaRegUserCircle size={18} />
                  <span>Profile</span>
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="px-8 py-4 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
                  style={{
                    background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                    boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <IoMdLogIn size={18} />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
