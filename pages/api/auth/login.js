export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Método ${req.method} não suportado`);
    }

    const { username, password } = req.body;

    // Credenciais do administrador - Em um projeto real, use variáveis de ambiente!
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Autenticação bem-sucedida
        res.status(200).json({ message: 'Login bem-sucedido' });
    } else {
        // Credenciais inválidas
        res.status(401).json({ message: 'Usuário ou senha inválidos' });
    }
}