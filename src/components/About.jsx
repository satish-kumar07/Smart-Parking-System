import { Target, Eye } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 px-6">
      <div className="max-w-[1000px] mx-auto text-center">
        <h2
          className="text-4xl md:text-[54px] leading-tight md:leading-[1.1] text-black dark:text-white mb-8"
          style={{
            fontFamily: "Libre Caslon Text, serif",
            fontWeight: "700",
          }}
        >
          About <em className="font-bold text-[#00D4AA]">Smart Parking EV</em>
        </h2>

        <p
          className="text-lg md:text-xl text-gray-600 dark:text-[#B0B0B0] leading-relaxed mb-12 max-w-[70ch] mx-auto"
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          We're a startup committed to solving one of the world's most
          frustrating urban problems — inefficient parking. By blending{" "}
          <strong className="text-[#00D4AA]">
            machine learning, IoT, and automation
          </strong>
          , we bring a smarter, sustainable way to manage parking for the
          electric future.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          {/* Mission */}
          <div className="bg-gradient-to-br from-[#00D4AA]/10 to-[#00B4E5]/10 rounded-3xl p-8 border border-[#00D4AA]/20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00D4AA] to-[#00B4E5] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={28} className="text-white" />
            </div>
            <h3
              className="text-2xl font-semibold text-black dark:text-white mb-4"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Mission
            </h3>
            <p className="text-gray-700 dark:text-[#B0B0B0] leading-relaxed text-lg">
              To revolutionize urban mobility through intelligent parking
              ecosystems.
            </p>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-[#00B4E5]/10 to-[#00D4AA]/10 rounded-3xl p-8 border border-[#00B4E5]/20">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00B4E5] to-[#00D4AA] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Eye size={28} className="text-white" />
            </div>
            <h3
              className="text-2xl font-semibold text-black dark:text-white mb-4"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Vision
            </h3>
            <p className="text-gray-700 dark:text-[#B0B0B0] leading-relaxed text-lg">
              To make parking effortless, eco-friendly, and data-driven.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 bg-gradient-to-r from-[#0A0A0B] to-[#1A1A2E] rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#00D4AA] mb-2">
              50M+
            </div>
            <div className="text-sm md:text-base text-gray-300">
              Parking Events Processed
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#00B4E5] mb-2">
              95%
            </div>
            <div className="text-sm md:text-base text-gray-300">
              Efficiency Improvement
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#FFB800] mb-2">
              24/7
            </div>
            <div className="text-sm md:text-base text-gray-300">
              Autonomous Operations
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
