import { useEffect, useState } from 'react';
import AdBanner from "./components/AdBanner";
import Footer from './components/Footer';
import './App.css';

const diskColors = ['#4a90e2', '#e94e77', '#50c878', '#f7b731', '#9b59b6'];

export default function App() {
  const [towers, setTowers] = useState([[], [], []]);
  const [selectedDisk, setSelectedDisk] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  const [diskCount, setDiskCount] = useState(3);
  const [showVictory, setShowVictory] = useState(false);

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
          setShowVictory(true);
          setTimeout(() => setShowVictory(false), 3000);
        }
      }
      setSelectedDisk(null);
    }
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
          Parabéns! Você venceu em {moveCount} movimentos!
        </div>
      )}

      <div className="ad-footer">
        <AdBanner />
      </div>
        <Footer />
    </div>
  );
}
