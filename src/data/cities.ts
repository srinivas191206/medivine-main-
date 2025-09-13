// Indian cities data for location autocomplete
export interface City {
  name: string;
  state: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export const indianCities: City[] = [
  // Major cities
  { name: 'Mumbai', state: 'Maharashtra', coordinates: [72.8777, 19.0760] },
  { name: 'Delhi', state: 'Delhi', coordinates: [77.1025, 28.7041] },
  { name: 'Bangalore', state: 'Karnataka', coordinates: [77.5946, 12.9716] },
  { name: 'Hyderabad', state: 'Telangana', coordinates: [78.4867, 17.3850] },
  { name: 'Chennai', state: 'Tamil Nadu', coordinates: [80.2707, 13.0827] },
  { name: 'Kolkata', state: 'West Bengal', coordinates: [88.3639, 22.5726] },
  { name: 'Pune', state: 'Maharashtra', coordinates: [73.8567, 18.5204] },
  { name: 'Ahmedabad', state: 'Gujarat', coordinates: [72.5714, 23.0225] },
  { name: 'Jaipur', state: 'Rajasthan', coordinates: [75.7873, 26.9124] },
  { name: 'Surat', state: 'Gujarat', coordinates: [72.8311, 21.1702] },
  
  // Andhra Pradesh & Telangana
  { name: 'Kakinada', state: 'Andhra Pradesh', coordinates: [82.2275, 16.9891] },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', coordinates: [83.3000, 17.6868] },
  { name: 'Vijayawada', state: 'Andhra Pradesh', coordinates: [80.6480, 16.5062] },
  { name: 'Guntur', state: 'Andhra Pradesh', coordinates: [80.4365, 16.3067] },
  { name: 'Tirupati', state: 'Andhra Pradesh', coordinates: [79.4192, 13.6288] },
  { name: 'Warangal', state: 'Telangana', coordinates: [79.5941, 17.9689] },
  { name: 'Karimnagar', state: 'Telangana', coordinates: [79.1288, 18.4386] },
  { name: 'Nizamabad', state: 'Telangana', coordinates: [78.0937, 18.6725] },
  
  // Other major cities
  { name: 'Kanpur', state: 'Uttar Pradesh', coordinates: [80.3319, 26.4499] },
  { name: 'Lucknow', state: 'Uttar Pradesh', coordinates: [80.9462, 26.8467] },
  { name: 'Nagpur', state: 'Maharashtra', coordinates: [79.0882, 21.1458] },
  { name: 'Indore', state: 'Madhya Pradesh', coordinates: [75.8577, 22.7196] },
  { name: 'Bhopal', state: 'Madhya Pradesh', coordinates: [77.4126, 23.2599] },
  { name: 'Vadodara', state: 'Gujarat', coordinates: [73.1812, 22.3072] },
  { name: 'Coimbatore', state: 'Tamil Nadu', coordinates: [76.9558, 11.0168] },
  { name: 'Kochi', state: 'Kerala', coordinates: [76.2673, 9.9312] },
  { name: 'Thiruvananthapuram', state: 'Kerala', coordinates: [76.9366, 8.5241] },
  { name: 'Mysore', state: 'Karnataka', coordinates: [76.6394, 12.2958] },
  { name: 'Chandigarh', state: 'Chandigarh', coordinates: [76.7794, 30.7333] },
  { name: 'Guwahati', state: 'Assam', coordinates: [91.7362, 26.1445] },
  { name: 'Bhubaneswar', state: 'Odisha', coordinates: [85.8245, 20.2961] },
  { name: 'Dehradun', state: 'Uttarakhand', coordinates: [78.0322, 30.3165] },
  { name: 'Shimla', state: 'Himachal Pradesh', coordinates: [77.1734, 31.1048] },
  { name: 'Jammu', state: 'Jammu and Kashmir', coordinates: [74.8570, 32.7266] },
  { name: 'Srinagar', state: 'Jammu and Kashmir', coordinates: [74.7973, 34.0837] },
  { name: 'Goa', state: 'Goa', coordinates: [74.1240, 15.2993] },
  { name: 'Raipur', state: 'Chhattisgarh', coordinates: [81.6296, 21.2514] },
  { name: 'Ranchi', state: 'Jharkhand', coordinates: [85.3240, 23.3441] },
  { name: 'Patna', state: 'Bihar', coordinates: [85.1376, 25.5941] },
  { name: 'Agra', state: 'Uttar Pradesh', coordinates: [78.0081, 27.1767] },
  { name: 'Varanasi', state: 'Uttar Pradesh', coordinates: [82.9739, 25.3176] },
  { name: 'Jodhpur', state: 'Rajasthan', coordinates: [73.0243, 26.2389] },
  { name: 'Udaipur', state: 'Rajasthan', coordinates: [73.7125, 24.5854] },
];

export const searchCities = (query: string): City[] => {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return indianCities
    .filter(city => 
      city.name.toLowerCase().includes(normalizedQuery) ||
      city.state.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 8); // Limit to 8 suggestions
};
