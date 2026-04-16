import { useState, useEffect } from 'react';
import { analyzeBusData } from './services/aiService';
import VoiceInput from './components/VoiceInput';
import { fetchRealBusData } from './services/busApiService';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'enabled';
  });
  const [loading, setLoading] = useState(true);
  const [sampleBuses, setSampleBuses] = useState([]);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  }, [darkMode]);

  // Load real bus data from API
  useEffect(() => {
    const loadBuses = async () => {
      setLoading(true);
      const realBuses = await fetchRealBusData();
      setSampleBuses(realBuses);
      setLoading(false);
    };
    loadBuses();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAskAI = async () => {
    if (!searchTerm.trim()) {
      alert("Please ask a question about the buses!");
      return;
    }
    
    setIsAnalyzing(true);
    setAiResponse("🤔 Analyzing with AI...");
    
    const response = await analyzeBusData(searchTerm, sampleBuses);
    setAiResponse(response);
    setIsAnalyzing(false);
  };

  const handleVoiceText = (spokenText) => {
    setSearchTerm(spokenText);
    setTimeout(() => {
      handleAskAI();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAskAI();
    }
  };

  // Show loading screen while fetching data
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading real bus data from transit API... 🚌</p>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <h1>
        🚌 Bus Analyzer with Voice AI
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </h1>
      
      <div className="search-section">
        <input 
          type="text"
          placeholder="Type or speak your question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="search-input"
          disabled={isListening}
        />
        <button 
          onClick={handleAskAI} 
          disabled={isAnalyzing || isListening}
          className="ask-button"
        >
          {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
        </button>
        <VoiceInput 
          onTextCaptured={handleVoiceText}
          isListening={isListening}
          setIsListening={setIsListening}
        />
      </div>

      {isListening && (
        <div className="listening-indicator">
          🎤 Listening... Speak your question now
        </div>
      )}

      {aiResponse && (
        <div className="ai-response">
          <h3>🤖 AI Response</h3>
          <p>{aiResponse}</p>
        </div>
      )}

      <div className="dashboard">
        <div className="stats-card">
          <h3>Active Buses</h3>
          <p>{sampleBuses.filter(b => b.status === "Active").length}</p>
        </div>
        <div className="stats-card">
          <h3>Total Routes</h3>
          <p>{sampleBuses.length}</p>
        </div>
        <div className="stats-card">
          <h3>Total Passengers</h3>
          <p>{sampleBuses.reduce((sum, b) => sum + b.passengers, 0)}</p>
        </div>
      </div>

      <div className="bus-list">
        <h2>Current Bus Schedule</h2>
        <table className="bus-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Bus Number</th>
              <th>Status</th>
              <th>Passengers</th>
            </tr>
          </thead>
          <tbody>
            {sampleBuses.map(bus => (
              <tr key={bus.id}>
                <td>{bus.route}</td>
                <td>{bus.busNumber}</td>
                <td><span className={`status-${bus.status.toLowerCase().replace(' ', '-')}`}>
                  {bus.status}
                </span></td>
                <td>{bus.passengers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>🚌 Bus Analyzer | Powered by OpenRouter AI | Voice Enabled | Real Transit API</p>
          <div className="footer-links">
            <a href="https://github.com/hiteshDking/bus-analyzer" target="_blank" rel="noopener noreferrer">
              📦 View on GitHub
            </a>
            <span className="footer-separator">|</span>
            <a href="https://vercel.com/hiteshdking/bus-analyzer" target="_blank" rel="noopener noreferrer">
              🚀 Deployed on Vercel
            </a>
          </div>
          <p className="footer-copyright">© 2026 Bus Analyzer | Made with ❤️ for better commuting</p>
        </div>
      </footer>
    </div>
  );
}

export default App;