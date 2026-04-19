import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import UserProfileModal from './UserProfileModal';
import TopupModal from './TopupModal';

const routeMeta = {
  '/': {
    eyebrow: 'Khởi tạo lá số',
    title: 'Bắt đầu từ ngày sinh',
    subtitle: 'Nhập dữ liệu một lần rồi di chuyển mượt qua các lớp luận giải.',
  },
  '/input': {
    eyebrow: 'Khởi tạo lá số',
    title: 'Bắt đầu từ ngày sinh',
    subtitle: 'Nhập dữ liệu một lần rồi di chuyển mượt qua các lớp luận giải.',
  },
  '/laso': {
    eyebrow: 'Lá số',
    title: 'Tổng quan bát tự',
    subtitle: 'Giữ các khối thông tin chính gần nhau để đọc nhanh trên màn hình nhỏ.',
  },
  '/phantich': {
    eyebrow: 'Phân tích',
    title: 'Đọc chiều sâu ngũ hành',
    subtitle: 'Ưu tiên phần luận giải trọng tâm và giảm nhiễu điều hướng.',
  },
  '/xemngay': {
    eyebrow: 'Xem ngày',
    title: 'Tra ngày cá nhân',
    subtitle: 'Giữ luồng chọn ngày, kiểm tra và so sánh trong một trục cuộn duy nhất.',
  },
  '/duyenso': {
    eyebrow: 'Duyên số',
    title: 'So khớp hai người',
    subtitle: 'Giảm cảm giác chật và ưu tiên các thao tác nhập liệu trên mobile.',
  },
  '/vanhan': {
    eyebrow: 'Vận hạn',
    title: 'Theo dõi chu kỳ',
    subtitle: 'Các chặng vận hạn cần được đọc liên tục, không bị ngắt bởi điều hướng.',
  },
  '/xinque': {
    eyebrow: 'Gieo quẻ',
    title: 'Xin quẻ nhanh',
    subtitle: 'Ưu tiên thao tác chạm, kết quả rõ tầng và khoảng thở tốt hơn.',
  },
  '/tuvan': {
    eyebrow: 'Tư vấn',
    title: 'Đặt câu hỏi riêng',
    subtitle: 'Luồng hỏi đáp được neo vào thao tác chính thay vì dàn đều mọi lựa chọn.',
  },
  '/dientich': {
    eyebrow: 'Điển tích',
    title: 'Đọc chậm, tra cứu nhanh',
    subtitle: 'Nội dung dài cần nhịp đọc rõ và không gian thoáng hơn.',
  },
  '/lich-su': {
    eyebrow: 'Lịch sử',
    title: 'Theo dõi các lần đã hỏi',
    subtitle: 'Ưu tiên tra cứu lại nhanh và quay lại đúng nhánh thao tác trước đó.',
  },
};

const getRouteMeta = (pathname) => {
  if (pathname.startsWith('/bai-viet/')) {
    return {
      eyebrow: 'Bài viết',
      title: 'Đọc chuyên sâu',
      subtitle: 'Nội dung dài cần khoảng thở lớn hơn và điểm neo rõ hơn trên mobile.',
    };
  }

  return routeMeta[pathname] || routeMeta['/'];
};

const headerTabs = [
  { id: 'date', path: '/xemngay', label: 'Ngày tốt', icon: '📅' },
  { id: 'matching', path: '/duyenso', label: 'Duyên số', icon: '🎎' },
  { id: 'cycles', path: '/vanhan', label: 'Vận hạn', icon: '📈' },
  { id: 'wisdom', path: '/dientich', label: 'Điển tích', icon: '📜' },
];

const PremiumMobileHeader = ({ currentMeta, hasData }) => {
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
        <button type="button" className="header-brand" onClick={() => navigate('/')} aria-label="Về trang chủ">
          <span className="brand-logo">☯️</span>
          <span className="brand-copy">
            <span className="brand-kicker">{currentMeta.eyebrow}</span>
            <h1 className="brand-text">Mệnh Số</h1>
          </span>
        </button>

        <div className="header-actions">
          {isAuthenticated ? (
            <button
              type="button"
              className={`user-pill ${showUserMenu ? 'active' : ''}`}
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Mở menu tài khoản"
            >
              <span className="pill-credits">💎 {user?.credits || 0}</span>
              <span className="pill-avatar">👤</span>
            </button>
          ) : (
            <button className="btn-login-premium" onClick={() => setShowAuthModal(true)}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {!isHomePage && (
        <div className="mobile-header-summary">
          <div className="header-summary-copy">
            <span className="summary-kicker">{currentMeta.eyebrow}</span>
            <strong className="summary-title">{currentMeta.title}</strong>
            <p className="summary-subtitle">{currentMeta.subtitle}</p>
          </div>
          <div className={`header-summary-badge ${hasData ? 'ready' : 'idle'}`}>
            <span>{hasData ? 'Đã có lá số' : 'Chưa có lá số'}</span>
          </div>
        </div>
      )}

      {!isHomePage && (
        <nav className="header-sub-nav" aria-label="Điều hướng nhanh">
          {headerTabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={{ pathname: tab.path, search: location.search }}
              className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="sub-nav-icon" aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      )}

      {showUserMenu && isAuthenticated && createPortal(
        <div className="user-dropdown-overlay" onClick={() => setShowUserMenu(false)}>
          <div className="user-dropdown animate-pop" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="user-sheet-close"
              onClick={() => setShowUserMenu(false)}
              aria-label="Đóng menu tài khoản"
            >
              ×
            </button>
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
                <span className="dropdown-btn-icon" aria-hidden="true">💳</span>
                <span>Nạp Linh Thạch (VietQR)</span>
              </button>
              <button className="dropdown-btn" onClick={() => { setShowProfileModal(true); setShowUserMenu(false); }}>
                <span className="dropdown-btn-icon" aria-hidden="true">👤</span>
                <span>Thông tin tài khoản</span>
              </button>
              <button className="dropdown-btn" onClick={() => { navigate('/lich-su'); setShowUserMenu(false); }}>
                <span className="dropdown-btn-icon" aria-hidden="true">🕘</span>
                <span>Lịch sử tư vấn</span>
              </button>
              <button className="dropdown-btn logout" onClick={handleLogout}>
                <span className="dropdown-btn-icon" aria-hidden="true">↗</span>
                <span>Đăng xuất</span>
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

  const leftTabs = [
    { id: 'chart', path: '/laso', label: 'Lá số', icon: '🎨' },
    { id: 'matrix', path: '/phantich', label: 'Phân tích', icon: '⚙️' },
  ];

  const rightTabs = [
    { id: 'que', path: '/xinque', label: 'Gieo quẻ', icon: '🎴' },
    { id: 'home', path: '/', label: 'Trang chủ', icon: '🏠', onClick: handleHomeClick },
  ];

  const centerTab = { id: 'consultant', path: '/tuvan', label: 'Tư vấn', icon: '☯️' };

  return (
    <nav className="mobile-bottom-nav" aria-label="Điều hướng chính">
      <div className="nav-left">
        {leftTabs.map((tab) => (
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

      <NavLink
        to={{ pathname: centerTab.path, search: location.search }}
        className={({ isActive }) => `bottom-nav-center ${isActive ? 'active' : ''}`}
      >
        <span className="center-icon">{centerTab.icon}</span>
        <span className="center-label">{centerTab.label}</span>
      </NavLink>

      <div className="nav-right">
        {rightTabs.map((tab) => (
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

const MobileShell = ({ children, hasData, onClearData }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/input';
  const pageClass = location.pathname.split('/').filter(Boolean).join('-') || 'home';
  const currentMeta = getRouteMeta(location.pathname);
  const topFixedRef = useRef(null);
  const [topOffset, setTopOffset] = useState(96);

  useEffect(() => {
    const headerEl = topFixedRef.current;
    if (!headerEl) return undefined;

    const updateOffset = () => {
      const nextOffset = Math.ceil(headerEl.getBoundingClientRect().height);
      if (nextOffset > 0) {
        setTopOffset(nextOffset);
      }
    };

    updateOffset();

    const observer = new ResizeObserver(() => {
      updateOffset();
    });

    observer.observe(headerEl);
    window.addEventListener('resize', updateOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateOffset);
    };
  }, [location.pathname, hasData]);

  return (
    <div
      className={`mobile-shell ${pageClass}-page ${isHomePage ? 'home-page' : ''}`}
      style={{ '--mobile-top-offset': `${topOffset}px` }}
    >
      <div className="mobile-top-fixed" ref={topFixedRef}>
        <PremiumMobileHeader currentMeta={currentMeta} hasData={hasData} />
      </div>
      <main className="mobile-content">
        {children}
      </main>
      <BottomNav onClearData={onClearData} />
    </div>
  );
};

export default MobileShell;
