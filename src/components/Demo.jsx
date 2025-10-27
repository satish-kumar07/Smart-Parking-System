import React, { useState, useRef } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function Demo() {
  const [formStatus, setFormStatus] = useState(null);
  const formRef = useRef(null);

  const handleSubmit = () => {
    setFormStatus("Thank you! We've received your demo request.");
    if (formRef.current) {
      setTimeout(() => formRef.current.reset(), 500);
    }
  };

  return (
    <section id="demo" className="py-16 md:py-24 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            <h2
              className="text-4xl md:text-[54px] leading-tight md:leading-[1.1] text-black dark:text-white mb-6"
              style={{
                fontFamily: "Libre Caslon Text, serif",
                fontWeight: "700",
              }}
            >
              Experience the Future of{" "}
              <em className="font-bold text-[#00D4AA]">Parking</em>
            </h2>

            <p
              className="text-lg md:text-xl text-gray-600 dark:text-[#B0B0B0] leading-relaxed mb-8"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Want to see how Smart Parking EV can transform your business or
              city? Request a live demo with our team.
            </p>

            <div className="space-y-4">
              {[
                "See real-time parking allocation in action",
                "Witness AI-powered vehicle classification",
                "Experience seamless EV charging integration",
                "Explore comprehensive analytics dashboard",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#00D4AA] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-[#B0B0B0]">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Google Form */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200 dark:border-[#404040]">
            <h3
              className="text-2xl font-semibold text-black dark:text-white mb-6"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Request Demo
            </h3>

            {/* Hidden iframe prevents redirect */}
            <iframe name="hidden_iframe" style={{ display: "none" }}></iframe>

            <form
              ref={formRef}
              action="https://docs.google.com/forms/d/e/1FAIpQLSciSrMGKYSvG-Vq6UUOabywfmPciWqeI1LiIUiHOSxyf0O-Mg/formResponse"
              method="POST"
              target="hidden_iframe"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="entry.1037798072" // Google Forms entry ID
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="entry.409289857" // Google Forms entry ID
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent"
                  placeholder="your.email@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-2"
                >
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="entry.1131840717" // Replace with your Google Forms field ID
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent"
                  placeholder="Your company or organization"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-[#B0B0B0] mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="entry.1710819350" // Google Forms entry ID
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent resize-none"
                  placeholder="Tell us about your parking challenges or specific demo interests..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00D4AA] to-[#00B4E5] hover:from-[#00C299] hover:to-[#00A3D4] text-white font-semibold rounded-xl transition-all duration-150 hover:scale-105"
              >
                <Send size={20} />
                Request Demo
              </button>
            </form>

            {formStatus && (
              <p className="mt-6 text-lg text-center text-[#00D4AA] font-semibold flex items-center justify-center gap-2">
                {formStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
