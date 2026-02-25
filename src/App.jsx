import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Navbar } from "@/layout/Navbar";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Footer } from "./layout/Footer";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

function App() {
  const main = useRef();
  const smoother = useRef();

  const onClickScroll = (trigger) => {
    smoother.current.scrollTo(trigger, true, "center center");
  };

  useGSAP(
    () => {
      window.scrollTo(0, 0);

      smoother.current = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 2,
        effects: true,
      });
      return () => smoother.current?.kill();
    },
    { scope: main }
  );
  return (
    <div className="min-h-screen overflow-x-hidden" ref={main} id="smooth-wrapper">
      <Navbar onClickScroll={onClickScroll} />
      <main id="smooth-content" className="min-h-screen">
        <Hero onClickScroll={onClickScroll} />
        <About />
        <Projects />
        <Experience />
        {/* <Testimonials /> */}
        <Contact />
        <Footer onClickScroll={onClickScroll} />
      </main>
    </div>
  );
}

export default App;
