import mongoose from 'mongoose';

const password = process.env.MONGODB_PASSWORD;

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(`mongodb+srv://curso:${password}@curso.thsdz.mongodb.net/torre-hanoi`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { disks } = req.query;
  const disksNum = parseInt(disks);

  try {
    await connectDB();
    const rankings = await Ranking.find({ disks: disksNum })
      .sort({ moves: 1 })
      .limit(5);
    return res.status(200).json(rankings);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
}