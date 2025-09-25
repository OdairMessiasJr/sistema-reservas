import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'db.json');

const readData = () => {
    const jsonData = fs.readFileSync(dbPath);
    return JSON.parse(jsonData);
};

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { salas, reservas } = readData();

            // Adiciona o nome da sala a cada reserva para facilitar a exibição
            const reservasComNomeDaSala = reservas.map(reserva => {
                const sala = salas.find(s => s.id === reserva.salaId);
                return {
                    ...reserva,
                    salaNome: sala ? sala.nome : 'Sala Desconhecida'
                };
            });

            res.status(200).json(reservasComNomeDaSala);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao ler os dados das reservas.' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Método ${req.method} não suportado`);
    }
}