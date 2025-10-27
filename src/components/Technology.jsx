import { Brain, Eye, Wifi, Cloud } from "lucide-react";

export default function Technology() {
  const technologies = [
    {
      icon: Brain,
      title: "Machine Learning (ML) Algorithms",
      description:
        "Predict parking demand, optimize slot assignment, and analyze usage patterns.",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description:
        "Vehicle recognition and license plate scanning for secure, contactless check-ins.",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Wifi,
      title: "IoT Sensors",
      description:
        "Real-time slot occupancy detection and charger status monitoring.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Cloud,
      title: "Cloud Dashboard",
      description:
        "Admins manage everything from a centralized platform — occupancy, usage, analytics.",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <section id="technology" className="py-16 md:py-24 px-6">
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
              The Tech Behind the{" "}
              <em className="font-bold text-[#00D4AA]">Intelligence</em>
            </h2>
          </div>

          {/* Technology cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;

              return (
                <div
                  key={tech.title}
                  className="group relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1A1A1A] dark:to-[#2A2A2A] rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-[#404040] hover:shadow-2xl transition-all duration-300 ease-out hover:-translate-y-2"
                >
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                  />

                  {/* Icon container */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent
                        size={28}
                        className="text-white"
                        strokeWidth={1.5}
                      />
                    </div>

                    {/* Number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-[#2A2A2A] border-2 border-gray-200 dark:border-[#404040] rounded-full flex items-center justify-center text-sm font-bold text-[#00D4AA] shadow-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3
                      className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-4 group-hover:text-[#00D4AA] transition-colors duration-300"
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {tech.title}
                    </h3>

                    <p
                      className="text-gray-600 dark:text-[#B0B0B0] leading-relaxed"
                      style={{
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {tech.description}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-[#00D4AA]/10 to-[#00B4E5]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-[#00B4E5]/10 to-[#00D4AA]/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
                </div>
              );
            })}
          </div>

          {/* Bottom CTA section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-[#00D4AA]/10 to-[#00B4E5]/10 rounded-3xl p-8 md:p-12 border border-[#00D4AA]/20">
              <h3
                className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                Ready to see our technology in action?
              </h3>
              <p className="text-gray-600 dark:text-[#B0B0B0] mb-6 max-w-[50ch] mx-auto">
                Experience the power of AI-driven parking management with a
                personalized demo.
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-[#00D4AA] to-[#00B4E5] hover:from-[#00C299] hover:to-[#00A3D4] text-white font-semibold rounded-2xl transition-all duration-150 hover:scale-105 shadow-lg">
                Request Technology Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
