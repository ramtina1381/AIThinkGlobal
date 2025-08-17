import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "./firebase";

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation(); // Hook to get current URL path
  const headerRef = useRef(null); // Ref to access the header DOM element
  const mobileNavToggleBtnRef = useRef(null); // Ref for the mobile nav toggle button
  const [userRole, setUserRole] = useState('user');
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    // 🔹 Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

const handleProfileClick = () => {
  setProfileMenuOpen(!profileMenuOpen);
};
const handleLogout = async () => {
    await signOut(auth);
    setUserRole(null);
    alert("You have been logged out.")
    navigate("/")
  };


  // --- Scroll-based 'scrolled' class on body ---
  useEffect(() => {
    const toggleScrolled = () => {
      // Access the header through the ref
      const selectHeader = headerRef.current;

      // Ensure header exists and has relevant sticky classes
      if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) {
        return;
      }

      // Add/remove 'scrolled' class on the body based on scroll position
      if (window.scrollY > 100) {
        document.body.classList.add('scrolled');
        setHeaderScrolled(true); // Also update React state for component's own class
      } else {
        document.body.classList.remove('scrolled');
        setHeaderScrolled(false); // Also update React state
      }
    };

    window.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled); // For initial load check

    // Cleanup: remove event listeners when component unmounts
    return () => {
      window.removeEventListener('scroll', toggleScrolled);
      window.removeEventListener('load', toggleScrolled);
    };
  }, []); // Empty dependency array means this runs once on mount

  // --- Mobile Navigation Toggle ---
  const toggleMobileNav = () => {
    // Toggle the mobileNavOpen state
    setMobileNavOpen(prev => !prev);
  };

  // Effect to apply/remove 'mobile-nav-active' class on body
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.classList.add('mobile-nav-active');
      // If using bi-list and bi-x, ensure toggle button reflects state
      if (mobileNavToggleBtnRef.current) {
        mobileNavToggleBtnRef.current.classList.remove('bi-list');
        mobileNavToggleBtnRef.current.classList.add('bi-x');
      }
    } else {
      document.body.classList.remove('mobile-nav-active');
      if (mobileNavToggleBtnRef.current) {
        mobileNavToggleBtnRef.current.classList.remove('bi-x');
        mobileNavToggleBtnRef.current.classList.add('bi-list');
      }
    }
  }, [mobileNavOpen]); // Re-run when mobileNavOpen state changes

  // --- Hide mobile nav on same-page/hash links (or any link click) ---
  const closeMobileNav = () => {
    if (mobileNavOpen) {
      setMobileNavOpen(false); // Close the mobile nav
    }
  };


  // --- Navmenu Scrollspy ---
  useEffect(() => {
    const navmenuScrollspy = () => {
      // Select all nav links inside the navmenu
      const navmenulinks = document.querySelectorAll('#navmenu a[href^="#"]'); // Only target hash links

      navmenulinks.forEach(navmenulink => {
        const hash = navmenulink.hash;
        if (!hash) return; // Skip links without a hash

        const section = document.querySelector(hash);
        if (!section) return; // Skip if section doesn't exist

        const position = window.scrollY + 200; // Offset for header height

        if (position >= section.offsetTop && position < (section.offsetTop + section.offsetHeight)) {
          // If the section is in view, add 'active' class to its corresponding nav link
          // First, remove 'active' from all other nav links
          document.querySelectorAll('#navmenu a').forEach(link => {
            if (link !== navmenulink) { // Don't remove if it's the current active one
              link.classList.remove('active');
            }
          });
          navmenulink.classList.add('active');
        } else {
          // If the section is not in view, remove 'active' class
          navmenulink.classList.remove('active');
        }
      });

      // Special handling for the root path if no specific section is active
      if (location.pathname === '/' && window.scrollY < 200) { // Adjust value as needed
        const homeLink = document.querySelector('.navmenu a[href="/"]');
        if (homeLink) {
          document.querySelectorAll('.navmenu a').forEach(link => link.classList.remove('active'));
          homeLink.classList.add('active');
        }
      }
    };

    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);

    // Cleanup: remove event listeners
    return () => {
      window.removeEventListener('load', navmenuScrollspy);
      document.removeEventListener('scroll', navmenuScrollspy);
    };
  }, [location.pathname]); // Re-run if path changes (e.g., navigating directly)


return (
    <header ref={headerRef} className={`header ${headerScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileNav}>
          <img src="/assets/img/logo.png" alt="logo" />
        </Link>

        <nav className={`navmenu ${mobileNavOpen ? 'open' : ''}`}>
          <ul className='main-nav'>
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>
            {user ? (
              <>
                <li className="profile-menu">
                  <button onClick={handleProfileClick} className="profile-btn">
                    Profile {profileMenuOpen ? "▲" : "▼"}
                  </button>
                  {profileMenuOpen && (
                    <ul className="dropdown">
                      <li><Link to="/profile">Setting</Link></li>
                      <li>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            ) : (
              <li><Link to="/auth?mode=login" className={location.pathname === '/auth' ? 'active' : ''}>Login</Link></li>
            )}
          </ul>
        </nav>
        
        <i
          ref={mobileNavToggleBtnRef}
          className={`mobile-nav-toggle ${mobileNavOpen ? 'open' : ''}`}
          onClick={toggleMobileNav}
        >
          ☰
        </i>
      </div>
    </header>
  );
}