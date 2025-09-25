import Layout from '../components/Layout';
import { AuthProvider } from '../context/AuthContext'; // Importe o AuthProvider
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    // Envolva o Layout com o AuthProvider
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;