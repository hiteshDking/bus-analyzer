// Real-time Bus Data Simulator - No API Key Needed!

// Sample fallback data
const getSampleBuses = () => {
  return [
    { id: 1, route: "Route 101", busNumber: "B-101", status: "Active", passengers: 23 },
    { id: 2, route: "Route 102", busNumber: "B-102", status: "On Time", passengers: 45 },
    { id: 3, route: "Route 103", busNumber: "B-103", status: "Delayed", passengers: 12 },
    { id: 4, route: "Route 104", busNumber: "B-104", status: "Active", passengers: 34 },
  ];
};

// Generate random realistic bus data
function generateRealisticBusData() {
  const routes = [
    { name: "Airport Express", number: "A-101", basePassengers: 35 },
    { name: "Downtown Shuttle", number: "D-202", basePassengers: 42 },
    { name: "University Line", number: "U-303", basePassengers: 28 },
    { name: "Metro Circular", number: "M-404", basePassengers: 38 },
    { name: "Coast Rider", number: "C-505", basePassengers: 25 },
    { name: "Night Owl", number: "N-606", basePassengers: 15 },
    { name: "Express West", number: "E-707", basePassengers: 32 },
    { name: "Eastside Connector", number: "EC-808", basePassengers: 29 }
  ];

  // Randomly select 4-6 routes
  const shuffled = [...routes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const selectedRoutes = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);
  
  const statuses = ['Active', 'On Time', 'Delayed'];
  
  return selectedRoutes.map((route, index) => {
    const variation = Math.floor(Math.random() * 20) - 10;
    const passengers = Math.max(5, route.basePassengers + variation);
    
    let status;
    const rand = Math.random();
    if (rand < 0.6) status = 'Active';
    else if (rand < 0.85) status = 'On Time';
    else status = 'Delayed';
    
    return {
      id: index + 1,
      route: route.name,
      busNumber: route.number,
      status: status,
      passengers: passengers,
      lastUpdated: new Date().toLocaleTimeString()
    };
  });
}

// Main function to fetch bus data
export async function fetchRealBusData() {
  try {
    console.log("🚌 Generating real-time bus data...");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const buses = generateRealisticBusData();
    
    console.log(`✅ Loaded ${buses.length} buses at ${new Date().toLocaleTimeString()}`);
    return buses;
    
  } catch (error) {
    console.error("Error:", error.message);
    return getSampleBuses();
  }
}

// Refresh function
export async function refreshBusData() {
  return await fetchRealBusData();
}