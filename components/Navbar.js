import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      {/* SEÇÃO DA ESQUERDA: LOGO */}
      <Link href="/" legacyBehavior>
        <a className={styles.brand}>
          <Image
            src="/logo.svg"
            alt="Logotipo do Sistema de Reservas"
            width={300}
            height={80}
            priority
          />
        </a>
      </Link>

      {/* ===== NOVO ===== */}
      {/* SEÇÃO DO CENTRO: TÍTULO */}
      <div className={styles.title}>
        <h1>SENAI VALINHOS</h1>
      </div>
      {/* ===== FIM DO NOVO ===== */}
      
      {/* SEÇÃO DA DIREITA: LINKS DE NAVEGAÇÃO */}
      <ul className={styles.navList}>
        <li>
          <Link href="/calendario" legacyBehavior>
            <a>Ver Reservas</a>
          </Link>
        </li>
        <li>
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