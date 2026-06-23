import { Link, useLocation } from 'react-router-dom';
import { IoChevronBack, IoPersonOutline } from 'react-icons/io5';
import { useHeader } from '../hooks/useHeader.jsx';
import styles from './Header.module.css';
import { HEADER_CONFIG } from '../headerConfig';
import appIconImg from '../../../../../public/images/linco-logo.jpg';
import { PATHS } from '../../../../routes/paths';

const Header = ({
  role = 'global',
  companyName = 'CompanyName',
  roomName = 'Company Demo',
}) => {
  const location = useLocation();

  const {
    dropdownRef,
    isDropdownOpen,
    isAuthenticated,
    fullName,
    initials,
    toggleDropdown,
    closeDropdown,
    handleLogout,
  } = useHeader();

  if (role !== 'global') {
    return (
      <header className={styles['workspace-top-header']}>
        <div className={styles['workspace-logo']}>
          <span className={styles['brand-name']}>LinCo</span>{' '}
          <span className={styles['company-name']}>.{companyName}</span>
        </div>
        <div className={styles['workspace-center']}>
          <Link to={PATHS.HOME} className={styles['go-dashboard']}>
            <IoChevronBack /> Go to my dashboard
          </Link>
          <div className={styles['nav-divider']}></div>
          <div className={styles['room-badge']}>{roomName}</div>
        </div>
        <div className={styles['workspace-right']}>
          <span className={styles['brand-name-full']}>Link Company</span>
        </div>
      </header>
    );
  }

  const globalLinks = HEADER_CONFIG.global.navLinks;

  return (
    <header className={styles.header}>
      <div className={styles['header-left']}>
        <div className={styles.logo}>
          <span className={styles['brand-name']}>LinCo</span>{' '}
          <span className={styles['company-text']}>Link Company.</span>
        </div>

        <div
          className={styles['user-profile']}
          ref={dropdownRef}
          onClick={toggleDropdown}
        >
          <div className={styles['user-avatar']}>{initials}</div>
          <span className={styles['user-name']}>{fullName}</span>
          <div
            className={`${styles['dropdown-icon']} ${isDropdownOpen ? styles['open'] : ''}`}
          ></div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className={styles['dropdown-menu']}>
              {isAuthenticated ? (
                <>
                  <Link
                    to={PATHS.PROFILE}
                    className={styles['dropdown-item']}
                    onClick={closeDropdown}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`${styles['dropdown-item']} ${styles['logout-btn']}`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={styles['dropdown-item']}
                    onClick={closeDropdown}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={styles['dropdown-item']}
                    onClick={closeDropdown}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className={styles['nav-links']}>
        {globalLinks.map((link, index) => (
          <div key={index} className={styles['nav-item-wrapper']}>
            <Link
              to={link.path}
              className={
                location.pathname === link.path ||
                (index === 0 && location.pathname === '/')
                  ? styles.active
                  : ''
              }
            >
              {link.name}
            </Link>
            {index < globalLinks.length - 1 && (
              <div className={styles['nav-divider']}></div>
            )}
          </div>
        ))}
      </nav>

      <div className={styles['header-actions']}>
        <button className={styles['btn-workspace']}>
          <IoPersonOutline style={{ marginRight: '5px' }} /> Create a Workspace
        </button>
        <div className={styles['app-icon']}>
          <img
            src={appIconImg}
            alt="App Icon"
            className={styles['app-icon-img']}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
