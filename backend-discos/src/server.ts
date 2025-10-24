import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Disco from './models/Disco'; // Importa o Model

// 1. Inicializa o Express
const app = express();
const PORT = 3000;

// 2. Configura os Middlewares
app.use(cors()); // Permite que o frontend acesse a API
app.use(express.json()); // Permite que o Express entenda JSON

// 3. Define a URL de conexão do MongoDB
const MONGO_URL = 'mongodb://localhost:27017/colecaoDiscos';

// --- ROTAS DO CRUD ---

/**
 * [CREATE] ROTA: POST /discos
 * Cadastra um novo disco.
 */
app.post('/discos', async (req: Request, res: Response) => {
    try {
        const { titulo, artista, ano, genero, formato, preco } = req.body;
        const novoDisco = new Disco({
            titulo,
            artista,
            ano,
            genero,
            formato,
            preco
        });
        const discoSalvo = await novoDisco.save();
        res.status(201).json(discoSalvo);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Erro ao salvar o disco.', error: error.message });
        } else {
            res.status(500).json({ message: 'Erro inesperado no servidor.' });
        }
    }
});

/**
 * [READ] ROTA: GET /discos
 * Lista todos os discos cadastrados.
 */
app.get('/discos', async (req: Request, res: Response) => {
    try {
        const discos = await Disco.find();
        res.status(200).json(discos);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Erro ao buscar discos.', error: error.message });
        } else {
            res.status(500).json({ message: 'Erro inesperado no servidor.' });
        }
    }
});

/**
 * [READ-BY-ID] ROTA: GET /discos/:id
 * Busca um disco específico pelo seu ID.
 */
app.get('/discos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const disco = await Disco.findById(id);
        if (!disco) {
            return res.status(4404).json({ message: 'Disco não encontrado.' });
        }
        res.status(200).json(disco);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Erro ao buscar o disco.', error: error.message });
        } else {
            res.status(500).json({ message: 'Erro inesperado no servidor.' });
        }
    }
});

/**
 * [UPDATE] ROTA: PUT /discos/:id
 * Atualiza um disco existente pelo seu ID.
 */
app.put('/discos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;
        const discoAtualizado = await Disco.findByIdAndUpdate(id, dadosAtualizados, { new: true });
        if (!discoAtualizado) {
            return res.status(404).json({ message: 'Disco não encontrado.' });
        }
        res.status(200).json(discoAtualizado);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: 'Erro ao atualizar o disco.', error: error.message });
        } else {
            res.status(500).json({ message: 'Erro inesperado no servidor.' });
        }
    }
});

/**
 * [DELETE] ROTA: DELETE /discos/:id
 * Exclui um disco pelo seu ID.
 */
app.delete('/discos/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const discoExcluido = await Disco.findByIdAndDelete(id);
        if (!discoExcluido) {
            return res.status(404).json({ message: 'Disco não encontrado.' });
        }
        res.status(200).json({ message: 'Disco excluído com sucesso.' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Erro ao excluir o disco.', error: error.message });
        } else {
            res.status(500).json({ message: 'Erro inesperado no servidor.' });
        }
    }
});

// --- FIM DAS ROTAS DO CRUD ---

// Rota de Teste
app.get('/', (req: Request, res: Response) => {
    res.send('API de Discos funcionando!');
});

// 5. Inicia o servidor e conecta ao MongoDB
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Conectado ao MongoDB com sucesso!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error.message);
    });