import { useState } from "react";
import { MapPin, Cpu, Car } from "lucide-react";

export default function Solutions() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const solutions = [
    {
      id: "space-management",
      icon: MapPin,
      title: "Space Management",
      description:
        "Real-time tracking of available slots through IoT sensors and computer vision. Every square meter is optimized, reducing congestion and idle space. Dynamic updates mean zero manual intervention.",
    },
    {
      id: "automated-allocation",
      icon: Cpu,
      title: "Automated Allocation",
      description:
        "AI-driven decision-making assigns the best parking slot for each vehicle type. 2W, 3W, or 4W — every vehicle gets guided to the nearest suitable space instantly.",
      isActive: true,
    },
    {
      id: "multi-vehicle-support",
      icon: Car,
      title: "Multi-Vehicle Support",
      description:
        "Supports electric two-wheelers, e-rickshaws, and four-wheelers under a single system. Flexible integration for future EV models and charging configurations.",
    },
  ];

  const isCardActive = (solution) => {
    return solution.isActive || hoveredCard === solution.id;
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section id="solutions" className="py-16 md:py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Section heading */}
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="text-4xl md:text-[54px] leading-tight md:leading-[1.1] text-black dark:text-white mb-6"
              style={{
                fontFamily: "Libre Caslon Text, serif",
                fontWeight: "700",
              }}
            >
              Our Smart Parking{" "}
              <em className="font-bold text-[#00D4AA]">Solution</em>
            </h2>

            <p
              className="text-base md:text-lg text-[#646461] dark:text-[#B0B0B0] max-w-[60ch] mx-auto"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              One platform. Endless possibilities. Designed for the future of
              mobility.
            </p>
          </div>

          {/* Solution cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {solutions.map((solution) => {
              const IconComponent = solution.icon;
              const active = isCardActive(solution);

              return (
                <div
                  key={solution.id}
                  role="button"
                  tabIndex={0}
                  className={`
                    relative p-8 md:p-10 rounded-3xl border transition-all duration-200 ease-out cursor-pointer group
                    focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-opacity-50
                    ${
                      active
                        ? "bg-gradient-to-br from-[#00D4AA] to-[#00B4E5] border-transparent shadow-2xl"
                        : "bg-white dark:bg-[#1E1E1E] border-[#E8E7E4] dark:border-[#404040] hover:bg-gray-50 dark:hover:bg-[#262626] hover:shadow-lg"
                    }
                  `}
                  onMouseEnter={() => setHoveredCard(solution.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Icon container */}
                  <div
                    className={`
                      w-16 h-16 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-200 ease-out
                      ${
                        active
                          ? "bg-white/20 border-white/30 backdrop-blur-sm"
                          : "bg-gradient-to-br from-[#00D4AA]/10 to-[#00B4E5]/10 border-[#00D4AA]/20 dark:border-[#00D4AA]/30"
                      }
                    `}
                  >
                    <IconComponent
                      size={28}
                      strokeWidth={1.5}
                      className={`transition-all duration-200 ease-out ${
                        active
                          ? "text-white"
                          : "text-[#00D4AA] group-hover:scale-110"
                      }`}
                    />
                  </div>

                  {/* Number badge */}
                  <div
                    className={`
                      absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200
                      ${
                        active
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-[#00D4AA]/10 text-[#00D4AA] border border-[#00D4AA]/20"
                      }
                    `}
                  >
                    {solutions.indexOf(solution) + 1}
                  </div>

                  {/* Title */}
                  <h3
                    className={`
                      text-2xl mb-4 transition-all duration-200 ease-out
                      ${active ? "text-white" : "text-black dark:text-white"}
                    `}
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: "600",
                    }}
                  >
                    {solution.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`
                      text-base leading-relaxed transition-all duration-200 ease-out
                      ${
                        active
                          ? "text-white/90"
                          : "text-[#6F6E6B] dark:text-[#B0B0B0]"
                      }
                    `}
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      fontWeight: "400",
                    }}
                  >
                    {solution.description}
                  </p>

                  {/* Hover effect overlay */}
                  {!active && (
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#00D4AA]/5 to-[#00B4E5]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
