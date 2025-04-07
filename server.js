import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const password = import.meta.env.VITE_MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://curso:${password}@curso.thsdz.mongodb.net/torre-hanoi`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB Atlas com sucesso!');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB Atlas:', error);
});

const rankingSchema = new mongoose.Schema({
  playerName: String,
  disks: Number,
  moves: Number,
  date: { type: Date, default: Date.now }
});

const Ranking = mongoose.model('Ranking', rankingSchema);

app.post('/ranking', async (req, res) => {
  try {
    const { playerName, disks, moves, date } = req.body;
    
    if (!playerName || !disks || !moves) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (disks < 3 || disks > 5) {
      return res.status(400).json({ error: 'Número de discos inválido' });
    }

    const normalizedPlayerName = playerName.toUpperCase();
    
    // Verifica se já existe um registro para este jogador com o mesmo número de discos
    const existingRecord = await Ranking.findOne({ 
      playerName: normalizedPlayerName,
      disks
    });

    if (existingRecord) {
      // Se o novo resultado for melhor, atualiza o registro existente
      if (moves < existingRecord.moves) {
        existingRecord.moves = moves;
        existingRecord.date = date || new Date();
        await existingRecord.save();
        return res.status(200).json(existingRecord);
      }
      return res.status(200).json(existingRecord);
    }

    // Se não existe registro, cria um novo
    const ranking = new Ranking({ 
      playerName: normalizedPlayerName, 
      disks, 
      moves, 
      date
    });
    await ranking.save();
    res.status(201).json(ranking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar ranking' });
  }
});

app.get('/ranking/:disks', async (req, res) => {
  try {
    const disks = parseInt(req.params.disks);
    const rankings = await Ranking.find({ disks })
      .sort({ moves: 1 })
      .limit(5);
    res.json(rankings);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});