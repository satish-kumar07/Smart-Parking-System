import { Zap, Battery, Activity, Smartphone } from "lucide-react";

export default function EVCharging() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section className="py-16 md:py-24 px-6 text-white" id="evcharging">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <h2
                className="text-4xl md:text-[54px] leading-tight md:leading-[1.1] text-white mb-6"
                style={{
                  fontFamily: "Libre Caslon Text, serif",
                  fontWeight: "700",
                }}
              >
                Parking + Charging ={" "}
                <em className="font-bold text-[#00D4AA]">Smart Energy Flow</em>
              </h2>

              <p
                className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                Our system ensures that every EV finds a charging slot
                effortlessly. We integrate power load balancing, smart
                scheduling, and charger health monitoring — all automated. Users
                can track charging progress from their dashboard or mobile app.
              </p>

              {/* Feature list */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Zap,
                    text: "Smart load balancing prevents grid overload",
                  },
                  {
                    icon: Battery,
                    text: "Real-time battery status and charging optimization",
                  },
                  {
                    icon: Activity,
                    text: "Predictive maintenance for charging infrastructure",
                  },
                  {
                    icon: Smartphone,
                    text: "Mobile app integration for seamless user experience",
                  },
                ].map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00D4AA] to-[#00B4E5] rounded-xl flex items-center justify-center flex-shrink-0">
                        <IconComponent size={20} className="text-white" />
                      </div>
                      <span className="text-gray-300">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              <button className="px-8 py-4 bg-gradient-to-r from-[#00D4AA] to-[#00B4E5] hover:from-[#00C299] hover:to-[#00A3D4] text-white font-semibold rounded-2xl transition-all duration-150 hover:scale-105 shadow-lg">
                Learn More About EV Integration
              </button>
            </div>

            {/* Right Column - Charging Visualization */}
            <div className="relative">
              {/* Main charging station mockup */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    EV Charging Hub
                  </h3>
                  <p className="text-sm text-gray-300">
                    Real-time monitoring & control
                  </p>
                </div>

                {/* Charging ports grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Array.from({ length: 8 }, (_, i) => {
                    const isActive = i < 5;
                    const chargingLevel = Math.floor(Math.random() * 100);
                    const isFullyCharged = chargingLevel > 95;

                    return (
                      <div
                        key={i}
                        className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                          isActive
                            ? isFullyCharged
                              ? "bg-green-500/20 border-green-400/50"
                              : "bg-yellow-500/20 border-yellow-400/50"
                            : "bg-white/5 border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-300">
                            Port {i + 1}
                          </span>
                          {isActive && (
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isFullyCharged
                                    ? "bg-green-400"
                                    : "bg-yellow-400 animate-pulse"
                                }`}
                              ></div>
                            </div>
                          )}
                        </div>

                        {isActive && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-400">Charge</span>
                              <span className="text-white">
                                {chargingLevel}%
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  isFullyCharged
                                    ? "bg-green-400"
                                    : "bg-yellow-400"
                                }`}
                                style={{ width: `${chargingLevel}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {!isActive && (
                          <div className="text-center text-xs text-gray-500">
                            Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Stats summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-white/5 rounded-xl border border-white/20">
                    <div className="text-lg font-bold text-[#00D4AA]">5/8</div>
                    <div className="text-xs text-gray-400">Active</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl border border-white/20">
                    <div className="text-lg font-bold text-[#00B4E5]">87%</div>
                    <div className="text-xs text-gray-400">Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-xl border border-white/20">
                    <div className="text-lg font-bold text-[#FFB800]">42kW</div>
                    <div className="text-xs text-gray-400">Total Load</div>
                  </div>
                </div>
              </div>

              {/* Floating energy flow indicators */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#00D4AA] rounded-full flex items-center justify-center animate-pulse">
                <Zap size={16} className="text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-[#00B4E5] rounded-full flex items-center justify-center animate-pulse delay-300">
                <Battery size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
