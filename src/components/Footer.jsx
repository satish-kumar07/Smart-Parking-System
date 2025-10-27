import { Car, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const companyLinks = [
    { name: "About", href: "#about" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#demo" },
    { name: "Press", href: "#" },
  ];

  const solutionLinks = [
    { name: "Space Management", href: "#solutions" },
    { name: "EV Integration", href: "#" },
    { name: "Smart Allocation", href: "#technology" },
  ];

  const resourceLinks = [
    { name: "Blog", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Use", href: "#" },
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <footer
        className="text-white py-16 px-6"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Logo and Brand - Centered */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00D4AA] to-[#00B4E5] rounded-lg flex items-center justify-center">
                <Car size={24} className="text-white" />
              </div>
              <span
                className="text-white text-[20px] font-semibold"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
              >
                Smart Parking EV
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-16">
                {/* Company */}
                <div>
                  <h3 className="text-[#00D4AA] font-semibold text-sm uppercase tracking-wider mb-4">
                    Company
                  </h3>
                  <div className="space-y-3">
                    {companyLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-gray-300 hover:text-white text-[15px] transition-colors duration-150 focus:outline-none focus:text-white"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div>
                  <h3 className="text-[#00B4E5] font-semibold text-sm uppercase tracking-wider mb-4">
                    Solutions
                  </h3>
                  <div className="space-y-3">
                    {solutionLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-gray-300 hover:text-white text-[15px] transition-colors duration-150 focus:outline-none focus:text-white"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h3 className="text-[#FFB800] font-semibold text-sm uppercase tracking-wider mb-4">
                    Resources
                  </h3>
                  <div className="space-y-3">
                    {resourceLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-gray-300 hover:text-white text-[15px] transition-colors duration-150 focus:outline-none focus:text-white"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Follow Us */}
                <div>
                  <h3 className="text-[#FF6B6B] font-semibold text-sm uppercase tracking-wider mb-4">
                    Follow Us
                  </h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => {
                      const IconComponent = link.icon;
                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00D4AA] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
                          aria-label={link.name}
                        >
                          <IconComponent
                            size={20}
                            className="text-gray-300 hover:text-white"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom row - Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p
              className="text-gray-400 text-[14px]"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              © 2025 Smart Parking EV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
