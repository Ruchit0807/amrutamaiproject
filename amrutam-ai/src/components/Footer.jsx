import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-accent/10">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center space-y-2">
        <p className="text-sm font-serif text-gray-300">Made with ❤️ by Ruchit Sonawane</p>
        <div className="flex justify-center gap-4 text-accent/80">
          <a href="#" aria-label="Instagram" className="hover:text-accent transition-colors"><FaInstagram /></a>
          <a href="#" aria-label="LinkedIn" className="hover:text-accent transition-colors"><FaLinkedin /></a>
          <a href="#" aria-label="X" className="hover:text-accent transition-colors"><FaXTwitter /></a>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} AMRUTAM AI. All rights reserved.</p>
      </div>
    </footer>
  );
}
