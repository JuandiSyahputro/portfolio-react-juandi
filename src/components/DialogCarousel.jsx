import gsap from "gsap";
import { AlertCircle, ArrowUpRight, CheckCircle, ChevronLeft, ChevronRight, Info, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconGithub } from "./custom-icons/IconGithub";
import { useDialog } from "@/hooks/UseContextHooks";

// Dialog Component with Carousel Support
const DialogCarousel = ({
  isOpen,
  onClose,
  slides = [], // Array of slide objects: [{ title, content, type, confirmText, cancelText, onConfirm }, ...]
  singleSlide = null, // For backward compatibility - single slide object
  showCloseButton = true,
  className = "max-w-md",
  showDots = true,
  showArrows = true,
  loop = false,
  currIdx = 0,
}) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const buttonsRef = useRef(null);
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);

  const [currentIndex, setCurrentIndex] = useState(currIdx);
  const [isAnimating, setIsAnimating] = useState(false);

  const { handleClickPopup } = useDialog();

  const normalizedSlides = singleSlide ? [singleSlide] : slides;
  const currentSlide = normalizedSlides[currentIndex] || {};

  const config = {
    default: { icon: Info, color: "bg-primary", textColor: "text-primary", bgLight: "bg-primary/10" },
    success: { icon: CheckCircle, color: "bg-green-500", textColor: "text-green-500", bgLight: "bg-green-50" },
    warning: { icon: AlertCircle, color: "bg-amber-500", textColor: "text-amber-500", bgLight: "bg-amber-50" },
    danger: { icon: Trash2, color: "bg-red-500", textColor: "text-red-500", bgLight: "bg-red-50" },
    info: { icon: Info, color: "bg-indigo-500", textColor: "text-indigo-500", bgLight: "bg-indigo-50" },
  };

  const getConfig = (type) => config[type] || config.default;
  const currentConfig = getConfig(currentSlide.type);

  useEffect(() => {
    if (isOpen) {
      const handleCurrentIndex = () => setCurrentIndex(currIdx);
      handleCurrentIndex();

      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      tl.fromTo(dialogRef.current, { opacity: 0, scale: 0.8, rotateX: -15 }, { opacity: 1, scale: 1, rotateX: 0, duration: 0.5, ease: "back.out(1.7)" }, "-=0.2");
      tl.fromTo(contentRef.current?.children || [], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.3");
      tl.fromTo(buttonsRef.current?.children || [], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.2");

      // Animate first slide in
      if (slideRefs.current[0]) {
        tl.fromTo(slideRefs.current[0], { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.3");
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [currIdx, isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });

    tl.to(buttonsRef.current?.children || [], { opacity: 0, y: 10, duration: 0.2, stagger: 0.05, ease: "power2.in" });
    tl.to(contentRef.current?.children || [], { opacity: 0, y: -10, duration: 0.2, stagger: 0.05, ease: "power2.in" }, "-=0.3");
    tl.to(dialogRef.current, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power2.in" }, "-=0.2");
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" }, "-=0.3");

    setCurrentIndex(currIdx);
  };

  const animateSlideChange = (direction, newIndex) => {
    if (isAnimating || !slideRefs.current[currentIndex]) return;

    setIsAnimating(true);
    const currentSlideEl = slideRefs.current[currentIndex];
    const nextSlideEl = slideRefs.current[newIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
      },
    });

    // Animate out current slide
    tl.to(currentSlideEl, {
      opacity: 0,
      x: direction === "next" ? -50 : 50,
      duration: 0.3,
      ease: "power2.in",
    });

    // Animate in new slide
    tl.fromTo(nextSlideEl, { opacity: 0, x: direction === "next" ? 50 : -50 }, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, "-=0.1");
  };

  const goToNext = () => {
    if (currentIndex < normalizedSlides.length - 1) {
      animateSlideChange("next", currentIndex + 1);
    } else if (loop) {
      animateSlideChange("next", 0);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      animateSlideChange("prev", currentIndex - 1);
    } else if (loop) {
      animateSlideChange("prev", normalizedSlides.length - 1);
    }
  };

  const goToSlide = (index) => {
    if (index === currentIndex || isAnimating) return;
    const direction = index > currentIndex ? "next" : "prev";
    animateSlideChange(direction, index);
  };

  if (!isOpen) return null;

  const IconComponent = currentConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div ref={overlayRef} onClick={handleClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog Container */}
      <div ref={dialogRef} className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full rounded-2xl shadow-2xl overflow-hidden transform perspective-1000 ${className}`} style={{ transformStyle: "preserve-3d" }}>
        {/* Progress Bar (for multi-slide) */}
        {/* {normalizedSlides.length > 1 && (
          <div className="w-full h-1 bg-gray-200">
            <div className={`h-full ${currentConfig.color} transition-all duration-500 ease-out`} style={{ width: `${((currentIndex + 1) / normalizedSlides.length) * 100}%` }} />
          </div>
        )} */}

        {/* Header */}
        <div className="grid items-center justify-between p-6 pb-2 gap-2 grid-cols-1">
          <div className="flex items-center gap-3 order-2 md:order-1">
            <div className={`p-2 rounded-full ${currentConfig.bgLight}`}>
              <IconComponent className={`w-6 h-6 ${currentConfig.textColor}`} />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold hover:text-primary">{currentSlide.title || "Dialog"}</h2>
              {normalizedSlides.length > 1 && (
                <span className="text-xs text-gray-400 font-medium">
                  Project {currentIndex + 1} of {normalizedSlides.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end order-1 md:order-2">
            {/* Navigation Arrows in Header */}
            {showArrows && normalizedSlides.length > 1 && (
              <div className="flex items-center gap-1 mr-2">
                <button
                  onClick={goToPrev}
                  disabled={currentIndex === 0 && !loop}
                  className="p-1.5 rounded-lg bg-surface disabled:hover:bg-surface not-disabled:hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentIndex === normalizedSlides.length - 1 && !loop}
                  className="p-1.5 rounded-lg bg-surface disabled:hover:bg-surface not-disabled:hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            )}

            {showCloseButton && (
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors group">
                <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Carousel Content */}
        <div ref={carouselRef} className="relative overflow-hidden min-h-[120px]">
          {normalizedSlides.map((slide, index) => {
            const slideConfig = getConfig(slide.type);
            const SlideIcon = slideConfig.icon;

            return (
              <div key={index} ref={(el) => (slideRefs.current[index] = el)} className={`absolute inset-0 px-6 py-4 ${index === currentIndex ? "relative" : "hidden"}`} style={{ opacity: index === currentIndex ? 1 : 0 }}>
                <div ref={index === currentIndex ? contentRef : null} className="text-gray-600 leading-relaxed">
                  {/* Optional: Slide-specific icon for visual variety */}
                  {slide.showIcon && (
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-full ${slideConfig.bgLight} animate-pulse`}>
                        <SlideIcon className={`w-8 h-8 ${slideConfig.textColor}`} />
                      </div>
                    </div>
                  )}

                  {typeof slide.content === "string" ? (
                    <p>{slide.content}</p>
                  ) : (
                    <div key={index} className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-video">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent opacity-60" />
                        {/* Overlay Links */}
                        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={() => handleClickPopup(slide.link)} className="p-3 rounded-full glass hover:bg-primary text-primary-foreground hover:text-primary-foreground transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleClickPopup(slide.github)} className="p-3 rounded-full glass hover:bg-primary text-primary-foreground hover:text-primary-foreground transition-all">
                            {/* <Github className="w-5 h-5" /> */}
                            <IconGithub className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <p className="text-muted-foreground text-sm">{slide.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {slide.tags.map((tag, tagIdx) => (
                            <span key={tagIdx} className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional: Custom footer content per slide */}
                  {slide.footer && <div className="mt-4 pt-4 border-t border-gray-100">{slide.footer}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div ref={buttonsRef} className="flex justify-center items-center gap-3 p-6 pt-2 glass-strong">
          {/* Dots Indicator */}
          {showDots && normalizedSlides.length > 1 && (
            <div className="flex gap-2">
              {normalizedSlides.map((_, index) => (
                <button key={index} onClick={() => goToSlide(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? `${currentConfig.color} w-6` : "bg-gray-300 hover:bg-gray-400"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { DialogCarousel };
