import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

export default function Demo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <section
        id="demo"
        className="py-16 md:py-24 px-6 bg-gradient-to-br from-[#00D4AA]/10 to-[#00B4E5]/10"
      >
        <div className="max-w-[600px] mx-auto text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-[#B0B0B0] text-lg">
            We've received your demo request. Our team will contact you within
            24 hours to schedule your personalized demo.
          </p>
        </div>
      </section>
    );
  }

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
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
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

          {/* Right Column - Form */}
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200 dark:border-[#404040]">
            <h3
              className="text-2xl font-semibold text-black dark:text-white mb-6"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Request Demo
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
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
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
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
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-[#404040] bg-white dark:bg-[#2A2A2A] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:border-transparent resize-none"
                  placeholder="Tell us about your parking challenges or specific demo interests..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00D4AA] to-[#00B4E5] hover:from-[#00C299] hover:to-[#00A3D4] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-150 hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Request Demo
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
