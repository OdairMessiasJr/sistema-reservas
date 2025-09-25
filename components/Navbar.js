import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link href="/" legacyBehavior>
        <a className={styles.brand}>Sistema de Reservas</a>
      </Link>
      <ul className={styles.navList}>
        <li>
          {/* MUDANÇA AQUI: Aponta para /calendario */}
          <Link href="/calendario" legacyBehavior>
            <a>Ver Reservas</a>
          </Link>
        </li>
        <li>
          {/* Este link leva para a tabela de agendamento do dia */}
          <Link href="/" legacyBehavior>
            <a>Agendar/Cancelar</a>
          </Link>
        </li>
        
        {isAdmin && (
          <li>
            <Link href="/adicionar-sala" legacyBehavior>
              <a>Adicionar Sala</a>
            </Link>
          </li>
        )}

        <li>
          {isAdmin ? (
            <button onClick={logout} className={styles.authButton}>Logout</button>
          ) : (
            <Link href="/login" legacyBehavior>
              <a className={styles.loginLink}>Login</a>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}