import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'db.json');

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
                const { salas } = readData();
                res.status(200).json(salas);
            } catch (error) {
                res.status(500).json({ message: 'Erro ao ler os dados das salas.' });
            }
            break;

        case 'POST':
            // ... (o código do POST continua o mesmo)
            try {
                const { nome } = req.body;
                if (!nome) {
                    return res.status(400).json({ message: 'O nome da sala é obrigatório.' });
                }

                const data = readData();
                const novaSala = {
                    id: data.salas.length > 0 ? Math.max(...data.salas.map(s => s.id)) + 1 : 1,
                    nome: nome,
                };

                data.salas.push(novaSala);
                writeData(data);

                res.status(201).json(novaSala);
            } catch (error) {
                res.status(500).json({ message: 'Erro ao salvar a nova sala.' });
            }
            break;
        
        // NOVO CASO PARA DELETAR SALA
        case 'DELETE':
            try {
                const { id } = req.body;
                if (!id) {
                    return res.status(400).json({ message: 'O ID da sala é obrigatório.' });
                }

                const dbData = readData();
                
                // Filtra a sala a ser removida
                const salasAtualizadas = dbData.salas.filter(sala => sala.id !== id);

                // Verifica se alguma sala foi realmente removida
                if (dbData.salas.length === salasAtualizadas.length) {
                    return res.status(404).json({ message: 'Sala não encontrada.' });
                }

                // Filtra as reservas, removendo as que pertenciam à sala deletada
                const reservasAtualizadas = dbData.reservas.filter(reserva => reserva.salaId !== id);

                // Salva os dados atualizados no arquivo
                writeData({ salas: salasAtualizadas, reservas: reservasAtualizadas });

                res.status(200).json({ message: 'Sala e suas reservas foram deletadas com sucesso.' });
            } catch (error) {
                res.status(500).json({ message: 'Erro ao deletar a sala.' });
            }
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']); // Adicione DELETE
            res.status(405).end(`Método ${method} não suportado`);
    }
}