import { useEffect, useState } from 'react';
import AdBanner from "./components/AdBanner";
import Footer from './components/Footer';
import LoginScreen from './components/LoginScreen';
import RankingScreen from './components/RankingScreen';
import './App.css';

const diskColors = ['#4a90e2', '#e94e77', '#50c878', '#f7b731', '#9b59b6'];

export default function App() {
  const [towers, setTowers] = useState([[], [], []]);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [diskCount, setDiskCount] = useState(3);
  const [showVictory, setShowVictory] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    initGame(diskCount);
  }, [diskCount]);

  function initGame(diskCount) {
    const initialTower = [];
    for (let i = diskCount - 1; i >= 0; i--) {
      initialTower.push(i);
    }
    setTowers([initialTower, [], []]);
    setMoveCount(0);
    setSelectedDisk(null);
    setShowVictory(false);
  }

  function handleTowerClick(index) {
    const newTowers = towers.map(t => [...t]);

    if (!selectedDisk && towers[index].length > 0) {
      const disk = towers[index][towers[index].length - 1];
      setSelectedDisk({ towerIndex: index, disk });
      return;
    }

    if (selectedDisk) {
      const { towerIndex, disk } = selectedDisk;
      if (
        index !== towerIndex &&
        (towers[index].length === 0 || towers[index][towers[index].length - 1] > disk)
      ) {
        newTowers[towerIndex].pop();
        newTowers[index].push(disk);
        setTowers(newTowers);
        setMoveCount(prev => prev + 1);
        if (newTowers[2].length === diskCount) {
          const newMoveCount = moveCount + 1;
          setShowVictory(true);
          setTimeout(() => saveGameResult(), 0);
        }
      }
      setSelectedDisk(null);
    }
  }

  const saveGameResult = async () => {
    try {
      const result = {
        playerName,
        disks: diskCount,
        moves: moveCount + 1,
        date: new Date().toISOString()
      };

      await fetch('/api/ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      });
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  const handleStartGame = (name) => {
    setPlayerName(name);
    setGameStarted(true);
    initGame(diskCount);
  };



  if (!gameStarted) {
    return <LoginScreen onStartGame={handleStartGame} />;
  }

  return (
    <div className="app">
      <div className="controls">
        <button onClick={() => initGame(diskCount)}>Reset</button>
        <select value={diskCount} onChange={e => setDiskCount(parseInt(e.target.value))}>
          {[3, 4, 5].map(n => (
            <option key={n} value={n}>{n} Disks</option>
          ))}
        </select>
        <div className="moveCount">Moves: {moveCount}</div>
      </div>

      <div className="container">
        {towers.map((tower, towerIndex) => (
          <div key={towerIndex} className="tower" onClick={() => handleTowerClick(towerIndex)}>
            {tower.map((disk, i) => (
              <div
                key={i}
                className={`disk ${selectedDisk?.disk === disk && selectedDisk?.towerIndex === towerIndex ? 'selected' : ''}`}
                style={{
                  width: `${40 + (disk / (diskCount - 1)) * 50}%`,
                  background: diskColors[disk % diskColors.length],
                  bottom: `${i * 22}px`
                }}
              >
                {disk + 1}
              </div>
            ))}
          </div>
        ))}
      </div>

      {showVictory && (
        <div className="victory">
          <h3>Parabéns, {playerName}!</h3>
          <p>Você completou o desafio com {diskCount} discos em {moveCount} movimentos!</p>
          <button onClick={() => setShowRanking(true)}>Ver Ranking</button>
          <button onClick={() => {
            setShowVictory(false);
            initGame(diskCount);
            setMoveCount(0);
          }}>Continuar Jogando</button>
        </div>
      )}

      <div className="ranking-container">
        <RankingScreen onBack={() => {}} shouldUpdate={showVictory} />
      </div>
      
      <div className="ad-footer">
        <AdBanner />
      </div>
      <Footer />
    </div>
  );
}
