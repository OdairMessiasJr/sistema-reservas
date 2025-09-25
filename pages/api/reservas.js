import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'db.json');

// ... (as funções readData e writeData continuam as mesmas)
const readData = () => {
    const jsonData = fs.readFileSync(dbPath);
    return JSON.parse(jsonData);
};

const writeData = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

export default function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            // ... (o código do GET continua o mesmo)
            try {
                const { data } = req.query;
                const allData = readData();
                const reservasFiltradas = data
                    ? allData.reservas.filter(r => r.data === data)
                    : allData.reservas;
                res.status(200).json(reservasFiltradas);
            } catch (error) {
                res.status(500).json({ message: 'Erro ao ler dados de reservas.' });
            }
            break;

        case 'POST':
            // ... (o código do POST continua o mesmo)
            try {
                const { salaId, data, periodo, responsavel } = req.body;

                if (!salaId || !data || !periodo || !responsavel) {
                    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
                }

                const dbData = readData();
                const jaReservado = dbData.reservas.some(
                    r => r.salaId === salaId && r.data === data && r.periodo === periodo
                );

                if (jaReservado) {
                    return res.status(409).json({ message: 'Este horário já está reservado.' });
                }

                const novaReserva = {
                    id: dbData.reservas.length > 0 ? Math.max(...dbData.reservas.map(r => r.id)) + 1 : 1,
                    salaId,
                    data,
                    periodo,
                    responsavel,
                };

                dbData.reservas.push(novaReserva);
                writeData(dbData);

                res.status(201).json(novaReserva);
            } catch (error) {
                res.status(500).json({ message: 'Erro ao criar reserva.' });
            }
            break;

        // NOVO CASO PARA DELETAR
        case 'DELETE':
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ message: 'O ID da reserva é obrigatório.' });
                }

                const dbData = readData();
                const reservaIndex = dbData.reservas.findIndex(r => r.id === id);

                if (reservaIndex === -1) {
                    return res.status(404).json({ message: 'Reserva não encontrada.' });
                }

                dbData.reservas.splice(reservaIndex, 1); // Remove a reserva
                writeData(dbData);

                res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
            } catch (error) {
                res.status(500).json({ message: 'Erro ao cancelar a reserva.' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']); // Adicione DELETE
            res.status(405).end(`Método ${method} não suportado`);
    }
}