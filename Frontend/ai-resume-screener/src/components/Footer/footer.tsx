import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const links: Record<string, { label: string; path: string }[]> = {
    Product: [
      { label: "Dashboard", path: "/" },
      { label: "History", path: "/history" },
      { label: "Admin", path: "/admin" },
      { label: "Profile", path: "/profile" },
    ],
    Company: [
      { label: "About", path: "/about" },
      { label: "Blog", path: "/blog" },
      { label: "Careers", path: "/careers" },
      { label: "Press", path: "/press" },
    ],
    Legal: [
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
      { label: "Cookie Policy", path: "/cookies" },
    ],
  };

  return (
    <footer className="w-full bg-slate-900 border-t border-white/10">
      <div className="w-full px-8 py-10 flex flex-col md:flex-row gap-10 items-start">

        <button onClick={() => navigate("/")} className="flex flex-col gap-3 w-64 shrink-0 text-left bg-transparent border-none cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-blue-500/40">
              AI
            </div>
            <span className="text-white font-bold text-base tracking-tight">
              Resume<span className="text-blue-400">Screener</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Streamline your hiring process with AI-powered resume screening. Fast, accurate, and unbiased.
          </p>
        </button>

        <div className="flex gap-12 flex-wrap ml-auto">
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="flex flex-col gap-3">
              <span className="text-white text-xs font-semibold uppercase tracking-widest">{category}</span>
              {items.map(({ label, path }) => (
                <Link key={label} to={path} className="text-slate-500 text-sm hover:text-slate-200 transition-colors duration-200 no-underline">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10" />

      <div className="w-full px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-slate-500 text-xs">© {currentYear} AI Resume Screener. All rights reserved.</p>
        <div className="flex items-center gap-5 text-slate-600 text-sm">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors duration-200">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors duration-200">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-300 transition-colors duration-200">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;