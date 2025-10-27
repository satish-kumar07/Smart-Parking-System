import { useState, useEffect } from "react";
import { Play, Car, Zap, Cpu } from "lucide-react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Hero() {
  const [animationVisible, setAnimationVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section
        id="home"
        className="relative py-20 md:py-32 px-6 text-white overflow-hidden"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-[1200px] mx-auto relative">
          {/* Main Headline Block */}
          <div className="text-center mb-16">
            <h1
              className="text-4xl md:text-[64px] leading-tight md:leading-[1.1] text-white mb-6 max-w-5xl mx-auto"
              style={{
                fontFamily: "Instrument Serif, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Smart Parking for a{" "}
              <em className="font-medium text-[#00D4AA]">Smarter</em> Tomorrow
            </h1>

            <p className="text-lg md:text-xl text-gray-300 opacity-90 mb-8 max-w-[65ch] mx-auto leading-relaxed">
              We automate parking space allocation for{" "}
              <strong className="text-[#00D4AA]">
                2W, 3W, and 4W vehicles
              </strong>
              , powered by{" "}
              <strong className="text-[#00B4E5]">
                AI, ML, and IoT sensors
              </strong>
              .
              <br />
              No waiting. No confusion. Just pure efficiency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
              <Link to={"/slot"}>
                <button
                  className="px-8 py-4 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
                  style={{
                    background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                    boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                  }}
                >
                  Slot Status
                </button>
              </Link>
              <HashLink
                smooth
                to="/#demovideo"
                className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
              >
                <div className="flex items-center justify-center w-6 h-6 border border-white/30 rounded-full">
                  <Play
                    size={10}
                    className="text-white opacity-80 ml-[1px] fill-white"
                  />
                </div>
                <span className="text-white font-semibold text-[15px]">
                  Watch How It Works
                </span>
              </HashLink>

              <Link to={"/scan"}>
                <button
                  className="px-8 py-4 rounded-2xl text-white font-semibold text-[15px] transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
                  style={{
                    background: "linear-gradient(135deg, #00D4AA, #00B4E5)",
                    boxShadow: "0 10px 25px rgba(0, 212, 170, 0.3)",
                  }}
                >
                  Book Slot
                </button>
              </Link>
            </div>
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="relative max-w-[1000px] mx-auto">
            <div className="relative">
              {/* Main Dashboard Frame */}
              <div
                className="relative rounded-3xl border border-white/20 backdrop-blur-sm overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-6"
                style={{
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      Smart Parking Dashboard
                    </h3>
                    <p className="text-sm text-gray-300">
                      Real-time parking allocation & analytics
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Live</span>
                  </div>
                </div>

                {/* Parking Grid Visualization */}
                <div className="grid grid-cols-8 md:grid-cols-12 gap-2 mb-6">
                  {Array.from({ length: 48 }, (_, i) => {
                    const isOccupied = Math.random() > 0.6;
                    const isEV = Math.random() > 0.7;
                    const isCharging = isEV && Math.random() > 0.5;

                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg border transition-all duration-300 ${
                          isOccupied
                            ? isCharging
                              ? "bg-yellow-400/80 border-yellow-300 shadow-yellow-400/30 shadow-lg"
                              : isEV
                              ? "bg-green-400/80 border-green-300"
                              : "bg-red-400/80 border-red-300"
                            : "bg-white/10 border-white/20 hover:bg-white/20"
                        } ${
                          animationVisible
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0"
                        }`}
                        style={{
                          transitionDelay: `${i * 20}ms`,
                        }}
                      >
                        {isOccupied && (
                          <div className="w-full h-full flex items-center justify-center">
                            {isCharging ? (
                              <Zap size={8} className="text-yellow-900" />
                            ) : isEV ? (
                              <Car size={8} className="text-green-900" />
                            ) : (
                              <Car size={8} className="text-red-900" />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Car size={16} className="text-[#00D4AA]" />
                      <span className="text-xs text-gray-300">Available</span>
                    </div>
                    <span className="text-2xl font-bold text-white">23</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-[#00B4E5]" />
                      <span className="text-xs text-gray-300">Charging</span>
                    </div>
                    <span className="text-2xl font-bold text-white">8</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu size={16} className="text-[#FFB800]" />
                      <span className="text-xs text-gray-300">Efficiency</span>
                    </div>
                    <span className="text-2xl font-bold text-white">94%</span>
                  </div>
                </div>
              </div>

              {/* Floating Callouts */}
              {/* <div
                className={`absolute bottom-6 left-6 transition-all duration-500 ${
                  animationVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <div className="bg-[#00D4AA] text-black px-4 py-2 rounded-2xl font-semibold text-sm whitespace-nowrap shadow-lg">
                  AI Allocation Active
                </div>
              </div>

              <div
                className={`absolute top-1/3 -right-4 transition-all duration-500 ${
                  animationVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: "800ms" }}
              >
                <div className="bg-[#00B4E5] text-white px-4 py-2 rounded-2xl font-semibold text-sm whitespace-nowrap shadow-lg">
                  IoT Sensors Online
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
