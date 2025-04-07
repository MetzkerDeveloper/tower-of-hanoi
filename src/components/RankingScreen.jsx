import { useState, useEffect } from 'react';

export default function RankingScreen({ onBack, shouldUpdate }) {
  const [rankings, setRankings] = useState({
    3: [],
    4: [],
    5: []
  });
  const [selectedDisks, setSelectedDisks] = useState(3);

  useEffect(() => {
    fetchRanking(selectedDisks);
  }, [selectedDisks, shouldUpdate]);

  const fetchRanking = async (disks) => {
    try {
      const response = await fetch(`/api/ranking/${disks}`);
      const data = await response.json();
      setRankings(prev => ({ ...prev, [disks]: data }));
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="ranking-screen">
      <h2>Ranking</h2>
      <div className="ranking-controls">
        <select 
          value={selectedDisks} 
          onChange={(e) => setSelectedDisks(Number(e.target.value))}
        >
          {[3, 4, 5].map(n => (
            <option key={n} value={n}>{n} Discos</option>
          ))}
        </select>
      </div>

      <div className="ranking-list">
        <h3>Melhores Jogadores - {selectedDisks} Discos</h3>
        <table>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>Movimentos</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {rankings[selectedDisks].map((score, index) => (
              <tr key={index} className={index === 0 ? 'best-score' : ''}>
                <td>{index + 1}º</td>
                <td>{score.playerName}</td>
                <td>{score.moves}</td>
                <td>{formatDate(score.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}