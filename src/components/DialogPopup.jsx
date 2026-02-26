/* eslint-disable no-unused-vars */
import { useRef, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, Trash2 } from "lucide-react";
import gsap from "gsap";

// Dialog Component
const DialogPopup = ({ isOpen, onClose, title, children, type = "default", onConfirm, confirmText = "Confirm", cancelText = "Cancel", showCloseButton = true }) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const buttonsRef = useRef(null);

  // Icon and color configurations based on type
  const config = {
    default: { icon: Info, color: "bg-blue-500", bgLight: "bg-blue-50", textColor: "text-blue-500" },
    success: { icon: CheckCircle, color: "bg-green-500", bgLight: "bg-green-50", textColor: "text-green-500" },
    warning: { icon: AlertCircle, color: "bg-amber-500", bgLight: "bg-amber-50", textColor: "text-amber-500" },
    danger: { icon: Trash2, color: "bg-red-500", bgLight: "bg-red-50", textColor: "text-red-500" },
    info: { icon: Info, color: "bg-primary", bgLight: "bg-primary-50", textColor: "text-primary" },
  };

  const { icon: IconComponent, color, bgLight, textColor } = config[type];

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Entrance animation timeline
      const tl = gsap.timeline();

      // Overlay fade in
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });

      // Dialog scale and fade in with elastic effect
      tl.fromTo(
        dialogRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 50,
          rotateX: -15,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

      // Content stagger animation
      tl.fromTo(contentRef.current.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, "-=0.3");

      // Buttons slide up
      tl.fromTo(buttonsRef.current.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" }, "-=0.2");
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    // Exit animation
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    // Buttons fade out
    tl.to(buttonsRef.current.children, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      stagger: 0.05,
      ease: "power2.in",
    });

    // Content fade out
    tl.to(
      contentRef.current.children,
      {
        opacity: 0,
        y: -10,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.in",
      },
      "-=0.3"
    );

    // Dialog scale down
    tl.to(
      dialogRef.current,
      {
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.3,
        ease: "power2.in",
      },
      "-=0.2"
    );

    // Overlay fade out
    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "-=0.3"
    );
  };

  const handleConfirm = () => {
    if (onConfirm) {
      // Confirm animation with checkmark effect
      gsap.to(dialogRef.current, {
        scale: 1.02,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          handleClose();
          setTimeout(onConfirm, 300);
        },
      });
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div ref={overlayRef} onClick={handleClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog Container */}
      <div ref={dialogRef} className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform perspective-1000" style={{ transformStyle: "preserve-3d" }}>
        {/* Top accent bar */}
        <div className={`h-1.5 w-full ${color}`} />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${bgLight}`}>
              <IconComponent className={`w-6 h-6 ${textColor}`} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>

          {showCloseButton && (
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors group">
              <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          )}
        </div>

        {/* Content */}
        <div ref={contentRef} className="px-6 py-4">
          <div className="text-gray-600 leading-relaxed">{children}</div>
        </div>

        {/* Footer Actions */}
        <div ref={buttonsRef} className="flex justify-end gap-3 p-6 pt-2 bg-gray-50/50">
          {/* <button onClick={handleClose} className="px-5 py-2.5 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105 active:scale-95">
            {cancelText}
          </button> */}

          <button onClick={handleConfirm} className={`px-5 py-2.5 rounded-xl text-white font-medium ${color} hover:brightness-110 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-${color.replace("bg-", "")}/30`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export { DialogPopup };

// Demo Application
// export default function DialogDemo() {
//   const [activeDialog, setActiveDialog] = useState(null);

//   const dialogs = [
//     {
//       id: "success",
//       type: "success",
//       title: "Changes Saved!",
//       content: "Your profile has been successfully updated. The changes will take effect immediately.",
//       confirmText: "Great!",
//       cancelText: "Close",
//     },
//     {
//       id: "warning",
//       type: "warning",
//       title: "Unsaved Changes",
//       content: "You have unsaved changes. Are you sure you want to leave this page? Your progress will be lost.",
//       confirmText: "Leave Page",
//       cancelText: "Stay",
//     },
//     {
//       id: "danger",
//       type: "danger",
//       title: "Delete Account",
//       content: "Are you absolutely sure? This action cannot be undone. All your data will be permanently removed from our servers.",
//       confirmText: "Delete",
//       cancelText: "Cancel",
//     },
//     {
//       id: "info",
//       type: "info",
//       title: "New Feature Available",
//       content: "Check out our new analytics dashboard! Get insights into your usage patterns and performance metrics.",
//       confirmText: "Try it Now",
//       cancelText: "Later",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-8">
//       <div className="max-w-4xl w-full">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Animated Dialogs</h1>
//           <p className="text-gray-300 text-lg">Beautiful, accessible dialog components with GSAP animations</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {dialogs.map((dialog) => (
//             <button
//               key={dialog.id}
//               onClick={() => setActiveDialog(dialog.id)}
//               className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
//               <div
//                 className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${
//                   dialog.type === "danger" ? "red" : dialog.type === "success" ? "green" : dialog.type === "warning" ? "amber" : "blue"
//                 }-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
//               />

//               <div className="flex items-center gap-4 mb-3">
//                 <div className={`p-3 rounded-xl bg-${dialog.type === "danger" ? "red" : dialog.type === "success" ? "green" : dialog.type === "warning" ? "amber" : "blue"}-500/20`}>
//                   {dialog.type === "danger" && <Trash2 className="w-6 h-6 text-red-400" />}
//                   {dialog.type === "success" && <CheckCircle className="w-6 h-6 text-green-400" />}
//                   {dialog.type === "warning" && <AlertCircle className="w-6 h-6 text-amber-400" />}
//                   {dialog.type === "info" && <Info className="w-6 h-6 text-blue-400" />}
//                 </div>
//                 <h3 className="text-xl font-semibold text-white">{dialog.title}</h3>
//               </div>

//               <p className="text-gray-400 text-left">Click to open {dialog.type} dialog with smooth GSAP animations</p>
//             </button>
//           ))}
//         </div>

//         {/* Render active dialog */}
//         {dialogs.map((dialog) => (
//           <Dialog
//             key={dialog.id}
//             isOpen={activeDialog === dialog.id}
//             onClose={() => setActiveDialog(null)}
//             title={dialog.title}
//             type={dialog.type}
//             confirmText={dialog.confirmText}
//             cancelText={dialog.cancelText}
//             onConfirm={() => {
//               console.log(`${dialog.type} dialog confirmed!`);
//               setActiveDialog(null);
//             }}>
//             <p>{dialog.content}</p>
//           </Dialog>
//         ))}
//       </div>
//     </div>
//   );
// }
