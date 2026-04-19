import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserProfileModal from './UserProfileModal';
import TopupModal from './TopupModal';

// Header navigation items (4 items)
const headerTabs = [
  { id: 'date', path: '/xemngay', label: 'XEM NGÀY', icon: '📅' },
  { id: 'matching', path: '/duyenso', label: 'DUYÊN SỐ', icon: '🎎' },
  { id: 'cycles', path: '/vanhan', label: 'VẬN HẠN', icon: '📈' },
  { id: 'wisdom', path: '/dientich', label: 'ĐIỂN TỊCH', icon: '📜' },
];

// Simplified Premium Header Component
const PremiumMobileHeader = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showTopupModal, setShowTopupModal] = useState(false);

    const isHomePage = location.pathname === '/' || location.pathname === '/input';

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/');
    };

    return (
        <header className="mobile-premium-header">
            <div className="header-main-row">
                <div className="header-brand" onClick={() => navigate('/')}>
                    <span className="brand-logo">☯️</span>
                    <h1 className="brand-text">MỆNH SỐ</h1>
                </div>

                <div className="header-actions">
                    {isAuthenticated ? (
                        <div className="user-pill" onClick={() => setShowUserMenu(!showUserMenu)}>
                            <span className="pill-credits">💎 {user?.credits || 0}</span>
                            <span className="pill-avatar">👤</span>
                        </div>
                    ) : (
                        <button className="btn-login-premium" onClick={() => setShowAuthModal(true)}>
                            ĐĂNG NHẬP
                        </button>
                    )}
                </div>
            </div>

            {!isHomePage && (
                <nav className="header-sub-nav">
                    {headerTabs.map(tab => (
                        <NavLink
                            key={tab.id}
                            to={{ pathname: tab.path, search: location.search }}
                            className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}
                        >
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>
            )}

            {/* Portals and Modals stay at the same logic level */}
            {showUserMenu && isAuthenticated && createPortal(
                <div className="user-dropdown-overlay" onClick={() => setShowUserMenu(false)}>
                    <div className="user-dropdown animate-pop" onClick={(e) => e.stopPropagation()}>
                        <div className="dropdown-header">
                            <span className="dropdown-avatar">👤</span>
                            <div className="dropdown-info">
                                <span className="dropdown-name">{user?.name || 'Mệnh chủ'}</span>
                                <span className="dropdown-email">{user?.email}</span>
                            </div>
                        </div>
                        <div className="dropdown-credits">
                            <span className="credits-label">Linh Thạch</span>
                            <span className="credits-value">💎 {user?.credits || 0}</span>
                        </div>
                        <div className="dropdown-actions">
                            <button className="dropdown-btn" onClick={() => { setShowTopupModal(true); setShowUserMenu(false); }}>
                                💳 Nạp Linh Thạch (VietQR)
                            </button>
                            <button className="dropdown-btn" onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}>
                                👤 Thông tin tài khoản
                            </button>
                            <button className="dropdown-btn" onClick={() => { navigate('/lich-su'); setShowUserMenu(false); }}>
                                📜 Lịch sử tư vấn
                            </button>
                            <button className="dropdown-btn logout" onClick={handleLogout}>
                                🚪 Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showAuthModal && createPortal(
                <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />,
                document.body
            )}
            {showProfileModal && createPortal(
                <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />,
                document.body
            )}
            {showTopupModal && createPortal(
                <TopupModal isOpen={showTopupModal} onClose={() => setShowTopupModal(false)} />,
                document.body
            )}
        </header>
    );
};

// Bottom Navigation Component - Redesigned with center button
const BottomNav = ({ onClearData }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (onClearData) {
      onClearData();
    }
    navigate('/');
  };

  // Left items
  const leftTabs = [
    { id: 'chart', path: '/laso', label: 'LÁ SỐ', icon: '🎨' },
    { id: 'matrix', path: '/phantich', label: 'PHÂN TÍCH', icon: '⚙️' },
  ];

  // Right items
  const rightTabs = [
    { id: 'que', path: '/xinque', label: 'GIEO QUẺ', icon: '🎴' },
    { id: 'home', path: '/', label: 'TRANG CHỦ', icon: '🏠', onClick: handleHomeClick },
  ];

  // Center button (Tư Vấn) - ☯️ Yin-Yang symbol for BaZi/Feng Shui
  const centerTab = { id: 'consultant', path: '/tuvan', label: 'TƯ VẤN', icon: '☯️' };

  return (
    <nav className="mobile-bottom-nav">
      <div className="nav-left">
        {leftTabs.map(tab => (
          <NavLink
            key={tab.id}
            to={{ pathname: tab.path, search: location.search }}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Center Floating Button */}
      <NavLink
        to={{ pathname: centerTab.path, search: location.search }}
        className={({ isActive }) => `bottom-nav-center ${isActive ? 'active' : ''}`}
      >
        <span className="center-icon">{centerTab.icon}</span>
        <span className="center-label">{centerTab.label}</span>
      </NavLink>

      <div className="nav-right">
        {rightTabs.map(tab => (
          tab.id === 'home' ? (
            <a
              key={tab.id}
              href="/"
              onClick={tab.onClick}
              className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </a>
          ) : (
            <NavLink
              key={tab.id}
              to={{ pathname: tab.path, search: location.search }}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </NavLink>
          )
        ))}
      </div>
    </nav>
  );
};

// Main Mobile Shell Component
const MobileShell = ({ children, hasData, onClearData }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/input';
  const pageClass = location.pathname.split('/').filter(Boolean).join('-') || 'home';

  return (
    <div className={`mobile-shell ${pageClass}-page ${isHomePage ? 'home-page' : ''}`}>
      <div className="mobile-top-fixed">
        <PremiumMobileHeader />
      </div>
      <main className="mobile-content">
        {children}
      </main>
      <BottomNav onClearData={onClearData} />
    </div>
  );
};

export default MobileShell;
