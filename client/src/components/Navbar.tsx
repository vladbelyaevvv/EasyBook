import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>BookMe</Link>
        <div className={styles.links}>
          {isAuthenticated ? (
            <>
              <span className={styles.username}>{user?.name}</span>
              {user?.role === 'SPECIALIST' && (
                <Link to="/specialist/dashboard">Панель</Link>
              )}
              <Link to="/appointments">Мои записи</Link>
              {user?.role !== 'SPECIALIST' && (
                <Link to="/become-specialist">Стать специалистом</Link>
                )}
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Войти</Link>
              <Link to="/register" className={styles.registerBtn}>
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
