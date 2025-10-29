import { Building, ShoppingBag, Zap, Plane } from "lucide-react";

export default function UseCases() {
  const useCases = [
    {
      icon: Building,
      title: "Corporate Campuses",
      description: "Seamless employee parking management.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ShoppingBag,
      title: "Malls & Smart Cities",
      description: "Automated slot allocation for high-traffic zones.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "EV Charging Hubs",
      description: "Integration with multiple vehicle types and chargers.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Plane,
      title: "Airports & Hotels",
      description: "Premium, automated valet parking experiences.",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <section id="usecases" className="py-16 md:py-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-4xl md:text-[54px] leading-tight md:leading-[1.1] text-black dark:text-white mb-6"
            style={{
              fontFamily: "Libre Caslon Text, serif",
              fontWeight: "700",
            }}
          >
            Where Smart Parking EV{" "}
            <em className="font-bold text-[#00D4AA]">Fits In</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <div
                key={useCase.title}
                className="group relative bg-gray-50 dark:bg-[#1A1A1A] rounded-3xl p-8 border border-gray-200 dark:border-[#404040] hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${useCase.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent size={28} className="text-white" />
                </div>

                <h3
                  className="text-xl font-semibold text-black dark:text-white mb-3"
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {useCase.title}
                </h3>

                <p className="text-gray-600 dark:text-[#B0B0B0] leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
