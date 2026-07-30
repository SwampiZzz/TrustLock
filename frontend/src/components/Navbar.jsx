import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Create Escrow', to: '/create-escrow' },
  { label: 'Escrows', to: '/escrows' },
  { label: 'How It Works', to: '/how-it-works' },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          TrustLock
        </NavLink>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `relative text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}

                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right Side */}
        <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
          Connect Wallet
        </button>

      </div>
    </nav>
  );
}

export default Navbar;