import mongoose from 'mongoose';

const password = process.env.MONGODB_PASSWORD;

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    
    if (!password) {
      throw new Error('Variável de ambiente MONGODB_PASSWORD não está definida');
    }

    await mongoose.connect(`mongodb+srv://curso:${password}@curso.thsdz.mongodb.net/torre-hanoi`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.error('Erro ao conectar com MongoDB:', error);
    throw error;
  }
};

const rankingSchema = new mongoose.Schema({
  playerName: String,
  disks: Number,
  moves: Number,
  date: { type: Date, default: Date.now }
});

let Ranking;
try {
  Ranking = mongoose.model('Ranking');
} catch {
  Ranking = mongoose.model('Ranking', rankingSchema);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { playerName, disks, moves, date } = req.body;
    
    if (!playerName || !disks || !moves) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (disks < 3 || disks > 5) {
      return res.status(400).json({ error: 'Número de discos inválido' });
    }

    const normalizedPlayerName = playerName.toUpperCase();
    
    await connectDB();
    
    const existingRecord = await Ranking.findOne({ 
      playerName: normalizedPlayerName,
      disks
    });

    if (existingRecord) {
      if (moves < existingRecord.moves) {
        existingRecord.moves = moves;
        existingRecord.date = date || new Date();
        await existingRecord.save();
        return res.status(200).json(existingRecord);
      }
      return res.status(200).json(existingRecord);
    }

    const ranking = new Ranking({ 
      playerName: normalizedPlayerName, 
      disks, 
      moves, 
      date: date || new Date()
    });
    await ranking.save();
    return res.status(201).json(ranking);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return res.status(500).json({ error: error.message || 'Erro ao salvar ranking' });
  }
}