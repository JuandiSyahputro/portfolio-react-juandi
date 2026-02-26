import gsap from "gsap";

import { experiences } from "@/utils/data-dummy";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Experience = (props) => {
  const containerExp = useRef();
  const containerTimeline = useRef();
  const progressBar = useRef();
  const dotBars = useRef([]);

  useGSAP(
    () => {
      gsap.fromTo(
        progressBar.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerTimeline.current,
            start: "top 80%",
            end: "bottom 25%",
            scrub: true,
          },
        }
      );

      dotBars.current.forEach((dot) => {
        ScrollTrigger.create({
          trigger: dot,
          start: "top center",
          end: "bottom center",
          onEnter: () => gsap.to(dot, { opacity: 1, scale: 1, duration: 0.3 }),
          onLeaveBack: () => gsap.to(dot, { opacity: 0, scale: 1, duration: 0.3 }),
        });
      });
    },
    { scope: containerTimeline }
  );
  return (
    <section id="experience" className="py-32 relative overflow-hidden" {...props}>
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10" ref={containerExp}>
        {/* Section Header */}
        <div className="max-w-3xl mb-16 z-30">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">Career Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Experience that <span className="font-serif italic font-normal text-white"> speaks volumes.</span>
          </h2>

          <p className="text-muted-foreground animate-fade-in animation-delay-200">A timeline of my professional growth, from curious beginner to senior engineer leading teams and building products at scale.</p>
        </div>

        {/* Timeline */}
        <div className="relative" ref={containerTimeline}>
          <div className="timeline-glow absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-primary/70 via-primary/50 to-transparent md:-translate-x-1/2 shadow-[0_0_25px_rgba(32,178,166,0.8)] origin-top" ref={progressBar} />
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-gray-800/20" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative grid md:grid-cols-2 gap-8" style={{ animationDelay: `${(idx + 1) * 150}ms` }}>
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 top-0 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10 opacity-0" ref={(el) => el && dotBars.current.push(el)}>
                  {exp.current && <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />}
                </div>

                {/* Content */}
                <div className={`pl-8 md:pl-0 ${idx % 2 === 0 ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16"}`}>
                  <div className={`glass p-6 rounded-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500`}>
                    <span className="text-sm text-primary font-medium">{exp.period}</span>
                    <h3 className="text-xl font-semibold mt-2">{exp.role}</h3>
                    <p className="text-muted-foreground">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-4">{exp.description}</p>
                    <div className={`flex flex-wrap gap-2 mt-4 ${idx % 2 === 0 ? "md:justify-end" : ""}`}>
                      {exp.technologies.map((tech, techIdx) => (
                        <span key={techIdx} className="px-3 py-1 bg-surface text-xs rounded-full text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
