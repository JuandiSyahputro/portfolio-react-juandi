import IconGithub from "@/components/custom-icons/IconGithub";
import IconInstagram from "@/components/custom-icons/IconInstagram";
import IconLinkedin from "@/components/custom-icons/IconLinkedin";

const socialLinks = [
  { icon: IconGithub, href: "https://github.com/JuandiSyahputro", label: "GitHub" },
  { icon: IconLinkedin, href: "https://www.linkedin.com/in/juandi-syahputro-08676b240/", label: "Linkedin" },
  { icon: IconInstagram, href: "https://www.instagram.com/msyhptr15/", label: "Instagram" },
];

const footerLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export const Footer = ({ onClickScroll }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#" className="text-xl font-bold tracking-tight">
              JS<span className="text-primary">.</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">© {currentYear} Juandi Syahputro. All rights reserved.</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <button key={link.label} onClick={() => onClickScroll(link.href)} aria-label={link.label} className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all" target="_blank">
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label} className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all" target="_blank">
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
