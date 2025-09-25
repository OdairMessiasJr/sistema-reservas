import { useState, useEffect } from 'react'; // Importe o useEffect
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext'; // Importe o hook de autenticação
import styles from '../styles/Form.module.css';

export default function AdicionarSala() {
    const [nomeSala, setNomeSala] = useState('');
    const router = useRouter();
    const { isAdmin } = useAuth(); // Verifique o status do admin

    // Efeito para proteger a rota
    useEffect(() => {
        // Se o carregamento do estado de auth terminou e o usuário não é admin, redireciona
        if (!isAdmin) {
            router.push('/login');
        }
    }, [isAdmin, router]);

    // Se ainda não foi verificado se é admin, não renderiza nada para evitar piscar a tela
    if (!isAdmin) {
        return <p>Redirecionando...</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (o resto da função handleSubmit continua igual)
        if (!nomeSala.trim()) {
            alert('O nome da sala é obrigatório.');
            return;
        }

        try {
            const response = await fetch('/api/salas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome: nomeSala }),
            });

            if (response.ok) {
                alert('Sala adicionada com sucesso!');
                router.push('/');
            } else {
                alert('Falha ao adicionar a sala.');
            }
        } catch (error) {
            console.error('Erro ao adicionar sala:', error);
            alert('Ocorreu um erro no servidor.');
        }
    };

    return (
        <div>
            <h1 className={styles.title}>Adicionar Nova Sala de Aula</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="nome-sala">Nome da Sala</label>
                    <input
                        type="text"
                        id="nome-sala"
                        value={nomeSala}
                        onChange={(e) => setNomeSala(e.target.value)}
                        placeholder="Ex: Laboratório de Química"
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>Adicionar Sala</button>
            </form>
        </div>
    );
}