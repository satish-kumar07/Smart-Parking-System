import {
  Play,
  Camera,
  Car,
  MapPin,
  Smartphone,
  CheckCircle,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Camera,
      title: "Vehicle enters",
      subtitle: "Camera scans license plate",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Car,
      title: "AI detects vehicle type",
      subtitle: "2W, 3W, or 4W classification",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: MapPin,
      title: "IoT sensors locate",
      subtitle: "Nearest available slot",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Smartphone,
      title: "Slot auto-assigned",
      subtitle: "Guided via app",
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: CheckCircle,
      title: "Session tracked",
      subtitle: "Parking + Charging in real time",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-6" id="howitworks">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-4xl md:text-[54px] leading-tight md:leading-[1.1] text-black dark:text-white mb-6"
            style={{
              fontFamily: "Libre Caslon Text, serif",
              fontWeight: "700",
            }}
          >
            How It <em className="font-bold text-[#00D4AA]">Works</em>
          </h2>
          <p className="text-gray-600 dark:text-[#B0B0B0] max-w-[60ch] mx-auto mb-8">
            Experience seamless parking automation in 5 simple steps
          </p>
        </div>

        {/* Steps flow */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-green-500 via-orange-500 to-red-500 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent size={32} className="text-white" />
                  </div>

                  <div className="bg-white dark:bg-[#2A2A2A] w-50 h-40 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-[#404040]">
                    <div className="text-sm font-bold text-[#00D4AA] mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-[#B0B0B0]">
                      {step.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="group flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-2xl mx-auto hover:scale-105 transition-all duration-150">
            <Play
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Watch Demo Video
          </button>
        </div>
      </div>
    </section>
  );
}
