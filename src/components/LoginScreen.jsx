import { useState } from 'react';

export default function LoginScreen({ onStartGame }) {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      onStartGame(playerName);
    }
  };

  return (
    <div className="login-screen">
      <h2>Torre de Hanoi</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerName">Nome do Jogador:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={!playerName.trim()}
        >
          Começar Jogo
        </button>
      </form>
    </div>
  );
}