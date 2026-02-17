function Header() {
  return (
    <header className="w-full bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
      
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold">
        AI Resume Screener
      </h1>

      {/* Navigation */}
      <nav className="space-x-6">
        <a href="#" className="hover:text-blue-400 transition">Home</a>
        <a href="#" className="hover:text-blue-400 transition">Upload</a>
        <a href="#" className="hover:text-blue-400 transition">About</a>
      </nav>

    </header>
  );
}

export default Header;
