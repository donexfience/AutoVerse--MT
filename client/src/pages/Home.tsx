import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { MorphingText } from "@/components/magicui/morphing-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { MarqueeDemo } from "../../utils/MarqueDemo";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent z-0"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute top-10 right-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-2xl z-0"></div>

      <div className="relative z-10">
        <nav
          className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <span className="text-xl font-semibold">AInoteTaker</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-gray-300">
              <a href="#" className="hover:text-white transition-colors">
                Download
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Easy To Access
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Customers
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Enterprise
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-gray-300">
            <a href="#" className="hover:text-white transition-colors">
              User
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Account
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="w-full mx-auto py-20">
          <div className="absolute top-6 right-1/4 w-80 h-64 bg-green-900/14 rounded-full blur-2xl z-0"></div>

          <div className="mb-8 text-center">
            <MorphingText
              className="text-8xl"
              texts={["AI POWERED", "NOTE MAKER"]}
            />
          </div>
          <div className="absolute top-56 left-1/4 transform -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl z-0"></div>
          <div className="absolute top-10 right-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-2xl z-0"></div>
          <div className="absolute top-120 right-10 w-64 h-64 bg-pink-500/12 rounded-full blur-2xl z-0"></div>
          <div className="absolute top-180 left-10 w-64 h-80 bg-green-500/12 rounded-full blur-2xl z-0"></div>

          <div className="mb-16 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BoxReveal boxColor={"#a855f7"} duration={0.5}>
              <p className="text-4xl sm:text-5xl font-bold tracking-tight px-20">
                CREATE YOUR NOTES WITH AI
                <span className="text-[#a855f7]">.</span>
              </p>
            </BoxReveal>

            <BoxReveal boxColor={"#a855f7"} duration={0.5}>
              <h2 className="mt-4 text-lg sm:text-xl text-gray-300 px-44">
                Effortless Note-Taking Powered by{" "}
                <span className="text-[#a855f7] font-semibold">
                  Artificial Intelligence
                </span>
              </h2>
            </BoxReveal>

            <BoxReveal boxColor={"#a855f7"} duration={0.5}>
              <div className="mt-6 text-base sm:text-lg text-gray-400">
                <p>
                  Capture ideas instantly with AI-driven organization, smart
                  tagging, and seamless syncing across devices. Built with
                  <span className="font-semibold text-[#a855f7]"> React</span>,
                  <span className="font-semibold text-[#a855f7]">
                    {" "}
                    TypeScript
                  </span>
                  ,
                  <span className="font-semibold text-[#a855f7]">
                    {" "}
                    Tailwind CSS
                  </span>
                  , and
                  <span className="font-semibold text-[#a855f7]"> Motion</span>.
                  <br />
                  Fully open-source, customizable, and designed for
                  productivity.
                </p>
              </div>
            </BoxReveal>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <ShimmerButton onClick={() => navigate("/canvas")}>
                GO TO CANVAS
              </ShimmerButton>
              <button
                className="text-purple-400 hover:text-purple-300 px-8 py-4 font-semibold text-lg transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore Github
              </button>
            </div>
          </div>
          {MarqueeDemo()}

          <div className="relative max-w-6xl mx-auto mt-24">
            {/* Desktop Interface */}
            <div className="mb-8">
              <img
                src="/assets/notes.webp"
                alt="AInoteTaker Desktop Interface"
                className="w-full h-auto rounded-xl shadow-2xl z-10"
              />
            </div>

            {/* Mobile Interface */}
            <div className="absolute -top-32 -right-12 w-72 z-10">
              <img
                src="/assets/mobile4.jpg"
                alt="AInoteTaker Mobile Interface"
                className="w-full h-auto rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
          <VelocityScroll className="text-gray-400">NOTE MAKER</VelocityScroll>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-900/80 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
