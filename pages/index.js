import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Home.module.css';

// ... (getTodayString e outras funções que não mudaram)
const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Home() {
    const [salas, setSalas] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [dataSelecionada, setDataSelecionada] = useState(getTodayString());
    const [loading, setLoading] = useState(true);
    const { isAdmin } = useAuth();

    const periodos = ['manha', 'tarde', 'noite'];

    useEffect(() => {
        fetchSalas();
    }, []);

    useEffect(() => {
        if (dataSelecionada) {
            fetchReservas(dataSelecionada);
        }
    }, [dataSelecionada]);

    const fetchSalas = async () => {
        try {
            const res = await fetch('/api/salas');
            const data = await res.json();
            setSalas(data);
        } catch (error) {
            console.error("Falha ao carregar salas:", error);
        }
    };

    const fetchReservas = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reservas?data=${data}`);
            const dataReservas = await res.json();
            setReservas(dataReservas);
        } catch (error) {
            console.error("Falha ao carregar reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    // NOVA FUNÇÃO PARA DELETAR SALA
    const handleDeleteSala = async (salaId) => {
        if (!confirm('Atenção! Deletar esta sala também removerá TODAS as suas reservas. Deseja continuar?')) {
            return;
        }

        try {
            const response = await fetch('/api/salas', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: salaId }),
            });

            if (response.ok) {
                alert('Sala deletada com sucesso!');
                // Recarrega tanto as salas quanto as reservas
                fetchSalas();
                fetchReservas(dataSelecionada);
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (error) {
            alert('Falha na conexão ao deletar a sala.');
        }
    };

    // ... (as funções handleBooking, handleCancel e isReservado continuam as mesmas)
    const handleBooking = async (salaId, periodo) => {
        const responsavel = prompt(`Por favor, insira seu nome para reservar a sala no período da ${periodo}:`);

        if (!responsavel) {
            alert("O nome do responsável é obrigatório.");
            return;
        }

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ salaId, data: dataSelecionada, periodo, responsavel }),
            });

            if (response.ok) {
                alert('Sala reservada com sucesso!');
                fetchReservas(dataSelecionada);
            } else {
                const errorData = await response.json();
                alert(`Erro: ${errorData.message}`);
            }
        } catch (error) {
            alert('Falha ao conectar com o servidor.');
        }
    };
    
    const handleCancel = async (reservaId) => {
        if (!confirm('Tem certeza de que deseja cancelar esta reserva?')) {
            return;
        }

        try {
            const response = await fetch('/api/reservas', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: reservaId }),
            });

            if (response.ok) {
                alert('Reserva cancelada com sucesso!');
                fetchReservas(dataSelecionada);
            } else {
                alert('Falha ao cancelar a reserva.');
            }
        } catch (error) {
            alert('Erro de conexão ao cancelar.');
        }
    };

    const isReservado = (salaId, periodo) => {
        return reservas.find(r => r.salaId === salaId && r.periodo === periodo);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Reservas de Salas</h1>

            <div className={styles.datePickerContainer}>
                <label htmlFor="date-picker">Selecione uma data:</label>
                <input
                    type="date"
                    id="date-picker"
                    value={dataSelecionada}
                    onChange={(e) => setDataSelecionada(e.target.value)}
                    className={styles.datePicker}
                />
            </div>

            {loading ? <p>Carregando...</p> : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sala</th>
                            <th>Manhã</th>
                            <th>Tarde</th>
                            <th>Noite</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salas.map((sala) => (
                            <tr key={sala.id}>
                                {/* Célula do nome da sala com o botão de deletar */}
                                <td className={styles.salaCell}>
                                    {sala.nome}
                                    {isAdmin && (
                                        <button 
                                          onClick={() => handleDeleteSala(sala.id)}
                                          className={styles.deleteSalaButton}
                                          title="Deletar sala"
                                        >
                                          &#128465; {/* Ícone de lixeira */}
                                        </button>
                                    )}
                                </td>
                                {periodos.map((periodo) => {
                                    const reserva = isReservado(sala.id, periodo);
                                    return (
                                        <td key={periodo}>
                                            {reserva ? (
                                                <div className={`${styles.slot} ${styles.reservado}`}>
                                                    Reservado por:<br/><strong>{reserva.responsavel}</strong>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleCancel(reserva.id)}
                                                            className={styles.cancelButton}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    className={`${styles.slot} ${styles.disponivel}`}
                                                    onClick={() => handleBooking(sala.id, periodo)}
                                                >
                                                    Reservar
                                                </button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}