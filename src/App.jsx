import { useState } from 'react';
import { analyzeBusData } from './services/aiService';
import VoiceInput from './components/VoiceInput';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [sampleBuses] = useState([
    { id: 1, route: "Route 101", busNumber: "B-101", status: "Active", passengers: 23 },
    { id: 2, route: "Route 102", busNumber: "B-102", status: "On Time", passengers: 45 },
    { id: 3, route: "Route 103", busNumber: "B-103", status: "Delayed", passengers: 12 },
    { id: 4, route: "Route 104", busNumber: "B-104", status: "Active", passengers: 34 },
  ]);

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
    // Auto-analyze after voice input (optional - comment out if you want manual submit)
    setTimeout(() => {
      handleAskAI();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAskAI();
    }
  };

  return (
    <div className="app">
      <h1>🚌 Bus Analyzer with Voice AI</h1>
      
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
    </div>
  );
}

export default App;