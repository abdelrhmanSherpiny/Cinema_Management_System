import { NavLink, Outlet } from 'react-router-dom';
import { Film, Ticket, Users, ShieldAlert, PlayCircle, LogIn, LogOut } from 'lucide-react';
import styles from './Layout.module.css';

export default function Layout({ supervisor, onLoginClick, onLogout }) {
  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <PlayCircle size={24} color="#fff" />
          </div>
          <span>CinemaHub</span>
        </div>

        <nav className={styles.navLinks}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
            }
            end
          >
            <Film size={20} />
            <span>Movies</span>
          </NavLink>
          {supervisor && (
            <>
              <div className={styles.sidebarDivider} />
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <Ticket size={20} />
                <span>Tickets</span>
              </NavLink>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <Users size={20} />
                <span>Customers</span>
              </NavLink>
              <NavLink
                to="/supervisors"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                <ShieldAlert size={20} />
                <span>Supervisors</span>
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* Top Bar */}
      <div className={styles.topBar}>
        {supervisor ? (
          <button
            className={`${styles.supervisorBtn} ${styles.supervisorActive}`}
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span className={styles.supervisorName}>
              {supervisor.first_Name} {supervisor.last_Name}
            </span>
            <span>Logout</span>
          </button>
        ) : (
          <button className={styles.supervisorBtn} onClick={onLoginClick}>
            <LogIn size={16} />
            <span>Login as Supervisor</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}
