export interface PincodeData {
  pincode: string;
  city: string;
  state: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export const pincodeDatabase: PincodeData[] = [
  // Andhra Pradesh
  { pincode: "533001", city: "Kakinada", state: "Andhra Pradesh", coordinates: [82.2275, 16.9891] },
  { pincode: "533002", city: "Kakinada", state: "Andhra Pradesh", coordinates: [82.2275, 16.9891] },
  { pincode: "533003", city: "Kakinada", state: "Andhra Pradesh", coordinates: [82.2275, 16.9891] },
  { pincode: "530001", city: "Visakhapatnam", state: "Andhra Pradesh", coordinates: [83.3132, 17.6868] },
  { pincode: "530002", city: "Visakhapatnam", state: "Andhra Pradesh", coordinates: [83.3132, 17.6868] },
  { pincode: "530003", city: "Visakhapatnam", state: "Andhra Pradesh", coordinates: [83.3132, 17.6868] },
  { pincode: "515001", city: "Anantapur", state: "Andhra Pradesh", coordinates: [77.6040, 14.6819] },
  { pincode: "515002", city: "Anantapur", state: "Andhra Pradesh", coordinates: [77.6040, 14.6819] },
  { pincode: "520001", city: "Vijayawada", state: "Andhra Pradesh", coordinates: [80.6480, 16.5062] },
  { pincode: "520002", city: "Vijayawada", state: "Andhra Pradesh", coordinates: [80.6480, 16.5062] },
  { pincode: "520003", city: "Vijayawada", state: "Andhra Pradesh", coordinates: [80.6480, 16.5062] },

  // Telangana
  { pincode: "500001", city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.3850] },
  { pincode: "500002", city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.3850] },
  { pincode: "500003", city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.3850] },
  { pincode: "500004", city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.3850] },
  { pincode: "500016", city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.3850] },
  { pincode: "500081", city: "Hyderabad", state: "Telangana", coordinates: [78.4867, 17.3850] },
  { pincode: "505001", city: "Karimnagar", state: "Telangana", coordinates: [79.1288, 18.4386] },
  { pincode: "505002", city: "Karimnagar", state: "Telangana", coordinates: [79.1288, 18.4386] },
  { pincode: "506001", city: "Warangal", state: "Telangana", coordinates: [79.5941, 17.9689] },
  { pincode: "506002", city: "Warangal", state: "Telangana", coordinates: [79.5941, 17.9689] },

  // Karnataka
  { pincode: "560001", city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716] },
  { pincode: "560002", city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716] },
  { pincode: "560003", city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716] },
  { pincode: "560004", city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716] },
  { pincode: "560025", city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716] },
  { pincode: "560100", city: "Bangalore", state: "Karnataka", coordinates: [77.5946, 12.9716] },
  { pincode: "575001", city: "Mangalore", state: "Karnataka", coordinates: [74.8560, 12.9141] },
  { pincode: "575002", city: "Mangalore", state: "Karnataka", coordinates: [74.8560, 12.9141] },
  { pincode: "580001", city: "Hubli", state: "Karnataka", coordinates: [75.1240, 15.3647] },
  { pincode: "580002", city: "Hubli", state: "Karnataka", coordinates: [75.1240, 15.3647] },

  // Tamil Nadu
  { pincode: "600001", city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827] },
  { pincode: "600002", city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827] },
  { pincode: "600003", city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827] },
  { pincode: "600004", city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827] },
  { pincode: "600020", city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827] },
  { pincode: "600100", city: "Chennai", state: "Tamil Nadu", coordinates: [80.2707, 13.0827] },
  { pincode: "641001", city: "Coimbatore", state: "Tamil Nadu", coordinates: [76.9558, 11.0168] },
  { pincode: "641002", city: "Coimbatore", state: "Tamil Nadu", coordinates: [76.9558, 11.0168] },
  { pincode: "620001", city: "Tiruchirappalli", state: "Tamil Nadu", coordinates: [78.7047, 10.7905] },
  { pincode: "620002", city: "Tiruchirappalli", state: "Tamil Nadu", coordinates: [78.7047, 10.7905] },

  // Kerala
  { pincode: "695001", city: "Thiruvananthapuram", state: "Kerala", coordinates: [76.9366, 8.5241] },
  { pincode: "695002", city: "Thiruvananthapuram", state: "Kerala", coordinates: [76.9366, 8.5241] },
  { pincode: "682001", city: "Kochi", state: "Kerala", coordinates: [76.2673, 9.9312] },
  { pincode: "682002", city: "Kochi", state: "Kerala", coordinates: [76.2673, 9.9312] },
  { pincode: "673001", city: "Kozhikode", state: "Kerala", coordinates: [75.7804, 11.2588] },
  { pincode: "673002", city: "Kozhikode", state: "Kerala", coordinates: [75.7804, 11.2588] },

  // Maharashtra
  { pincode: "400001", city: "Mumbai", state: "Maharashtra", coordinates: [72.8777, 19.0760] },
  { pincode: "400002", city: "Mumbai", state: "Maharashtra", coordinates: [72.8777, 19.0760] },
  { pincode: "400020", city: "Mumbai", state: "Maharashtra", coordinates: [72.8777, 19.0760] },
  { pincode: "411001", city: "Pune", state: "Maharashtra", coordinates: [73.8567, 18.5204] },
  { pincode: "411002", city: "Pune", state: "Maharashtra", coordinates: [73.8567, 18.5204] },
  { pincode: "444001", city: "Akola", state: "Maharashtra", coordinates: [77.0082, 20.7002] }
];

export const searchPincode = (pincode: string): PincodeData | null => {
  return pincodeDatabase.find(item => item.pincode === pincode) || null;
};

export const getPincodeSuggestions = (partialPincode: string): PincodeData[] => {
  if (partialPincode.length < 2) return [];
  
  return pincodeDatabase
    .filter(item => item.pincode.startsWith(partialPincode))
    .slice(0, 5); // Limit to 5 suggestions
};

export const getCitiesFromPincode = (pincode: string): string[] => {
  const result = searchPincode(pincode);
  return result ? [result.city] : [];
};