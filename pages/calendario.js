import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '../styles/Calendar.module.css';

// Configuração do localizador para o date-fns com o idioma português
const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }),
    getDay,
    locales,
});

// Função para converter nossas reservas em eventos que o calendário entende
const converterReservasParaEventos = (reservas) => {
    return reservas.map(reserva => {
        const [year, month, day] = reserva.data.split('-').map(Number);
        
        let startHour, endHour;
        switch (reserva.periodo) {
            case 'manha':
                startHour = 8;
                endHour = 12;
                break;
            case 'tarde':
                startHour = 13;
                endHour = 17;
                break;
            case 'noite':
                startHour = 18;
                endHour = 22;
                break;
            default:
                startHour = 9;
                endHour = 17;
        }

        return {
            id: reserva.id,
            title: `${reserva.salaNome} (${reserva.responsavel})`,
            start: new Date(year, month - 1, day, startHour),
            end: new Date(year, month - 1, day, endHour),
            resource: reserva.salaId, // ID da sala para referência
        };
    });
};

export default function PaginaCalendario() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTodasAsReservas = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/reservas/all');
                const data = await res.json();
                const eventosFormatados = converterReservasParaEventos(data);
                setEventos(eventosFormatados);
            } catch (error) {
                console.error("Falha ao carregar as reservas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTodasAsReservas();
    }, []);

    if (loading) {
        return <p className={styles.loading}>Carregando calendário...</p>;
    }

    return (
        <div className={styles.calendarContainer}>
            <h1 className={styles.title}>Calendário de Reservas</h1>
            <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '70vh' }} // Ajuste a altura conforme necessário
                culture='pt-BR'
                messages={{
                    next: "Próximo",
                    previous: "Anterior",
                    today: "Hoje",
                    month: "Mês",
                    week: "Semana",
                    day: "Dia",
                    agenda: "Agenda",
                    noEventsInRange: "Não há reservas neste período.",
                }}
            />
        </div>
    );
}