import { AnimatedBackground } from "animated-backgrounds";
import Hero from "../components/Hero";
import Solutions from "../components/Solutions";
import Technology from "../components/Technology";
import EVCharging from "../components/EVCharging";
import HowItWorks from "../components/HowItWorks";
import UseCases from "../components/UseCases";
import About from "../components/About";
import Demo from "../components/Demo";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <Solutions />
      <Technology />
      <EVCharging />
      <HowItWorks />
      <UseCases />
      <About />
      <Demo />
      <Footer id="footer" />
    </div>
  );
};

export default Home;
