import gsap from "gsap";
import { useRef } from "react";

import { useDialog } from "@/hooks/UseContextHooks";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { DialogCarousel } from "@/components/DialogCarousel";
import { Footer } from "@/layout/Footer";
import { Navbar } from "@/layout/Navbar";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { projects } from "@/utils/data-dummy";
import { DialogPopup } from "./components/DialogPopup";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

function App() {
  const main = useRef();
  const smoother = useRef();

  const { openDialog, handleCloseDialog, openPopup, handleCloseClickPopup } = useDialog();

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
      <DialogCarousel isOpen={openDialog} onClose={handleCloseDialog} className="max-w-3xl glass" slides={projects} currIdx={2} />
      <DialogPopup isOpen={openPopup} onClose={handleCloseClickPopup} title="Project Currently Inactive" type="info" confirmText="Close" onConfirm={handleCloseClickPopup} showCloseButton={false}>
        <p>This project is not active at the moment. Please check back later for updates.</p>
      </DialogPopup>
    </div>
  );
}

export default App;
