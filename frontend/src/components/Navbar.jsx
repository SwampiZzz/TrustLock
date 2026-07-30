const links = [
  { label: 'Home', href: '#home' },
  { label: 'Create Escrow', href: '#create-escrow' },
  { label: 'Escrows', href: '#escrows' },
  { label: 'About', href: '#about' },
];

function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#home" className="text-lg font-semibold tracking-tight text-slate-900">
          TrustLock
        </a>

        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-200 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
