import React, { useState } from 'react';
import { Search, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MedicineSearchPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const medicines = [
    {
      id: 1,
      name: 'Metformin 500 mg Tablet',
      stripSize: '10 tablets',
      price: 6,
      description: 'A first-line oral antidiabetic that lowers blood sugar by reducing glucose production and improving insulin sensitivity.',
      useFor: 'Managing Type 2 diabetes mellitus',
      prescription: true
    },
    {
      id: 2,
      name: 'Metformin PR (Sustained Release) 500 mg',
      stripSize: '10 tablets',
      price: 11,
      description: 'Slow-release formulation for steadier sugar control and fewer side effects.',
      useFor: 'Improved glycemic control in Type 2 diabetes',
      prescription: true
    },
    {
      id: 3,
      name: 'Ciprofloxacin 500 mg Tablet IP',
      stripSize: '10 tablets',
      price: 22,
      description: 'Broad-spectrum fluoroquinolone antibiotic for bacterial infections.',
      useFor: 'Bacterial infections like UTI, GI, or respiratory',
      prescription: true
    },
    {
      id: 4,
      name: 'Ciprofloxacin 500 mg + Tinidazole 600 mg (Combo)',
      stripSize: '10 tablets',
      price: 39,
      description: 'Antibiotic + antiprotozoal combination for mixed infections.',
      useFor: 'Mixed bacterial and protozoal infections',
      prescription: true
    },
    {
      id: 5,
      name: 'Azithromycin 500 mg Tablet',
      stripSize: '10 tablets',
      price: 86.60,
      description: 'Long-acting macrolide antibiotic with once-daily dosing.',
      useFor: 'Respiratory and skin infections',
      prescription: true
    },
    {
      id: 6,
      name: 'Pantoprazole 40 mg Enteric-Coated Tablet',
      stripSize: '10 tablets',
      price: 7.20,
      description: 'Proton pump inhibitor that lowers stomach acid.',
      useFor: 'GERD, ulcers, acidity',
      prescription: false
    },
    {
      id: 7,
      name: 'Omeprazole 20 mg Capsule',
      stripSize: '10 capsules',
      price: 6.82,
      description: 'PPI for acid suppression, similar to pantoprazole.',
      useFor: 'Acid reflux, gastritis',
      prescription: false
    },
    {
      id: 8,
      name: 'Paracetamol 650 mg Tablet IP',
      stripSize: '15 tablets',
      price: 8.03,
      description: 'Standard pain reliever and fever reducer.',
      useFor: 'Fever relief and mild-to-moderate pain',
      prescription: false
    },
    {
      id: 9,
      name: 'Dolo-650 (Paracetamol 650 mg Tablet)',
      stripSize: '15 tablets',
      price: 32.50,
      description: 'Branded paracetamol formulation widely trusted in India; fast-acting and effective for fever and body pain.',
      useFor: 'Fever, body aches, headache, and general pain relief',
      prescription: false
    },
    {
      id: 10,
      name: 'Diclofenac + Paracetamol + Serratiopeptidase',
      stripSize: '10 tablets',
      price: 7.96,
      description: 'Pain relief with anti-inflammatory action.',
      useFor: 'Musculoskeletal pain, inflammation, post-surgery pain',
      prescription: false
    },
    {
      id: 11,
      name: 'Ondansetron 4 mg Tablet IP',
      stripSize: '10 tablets',
      price: 2.84,
      description: 'Antiemetic blocking serotonin to stop nausea/vomiting.',
      useFor: 'Nausea and vomiting (post-op, chemotherapy)',
      prescription: true
    },
    {
      id: 12,
      name: 'Amoxicillin 500 mg Capsule',
      stripSize: '10 capsules',
      price: 22.50,
      description: 'A widely used penicillin-class antibiotic that fights bacterial infections by stopping bacterial growth.',
      useFor: 'Respiratory infections, ear infections, skin and urinary tract infections',
      prescription: true
    },
    {
      id: 13,
      name: 'Augmentin 625 mg Tablet (Amoxicillin + Clavulanic Acid)',
      stripSize: '6 tablets',
      price: 125,
      description: 'Combination antibiotic that broadens amoxicillin\'s spectrum by adding clavulanic acid, which resists bacterial enzymes.',
      useFor: 'Severe respiratory infections, dental infections, and resistant bacterial infections',
      prescription: true
    },
    {
      id: 14,
      name: 'Atorvastatin 10 mg Tablet',
      stripSize: '10 tablets',
      price: 31.50,
      description: 'A statin that lowers bad cholesterol (LDL) and triglycerides while raising good cholesterol (HDL).',
      useFor: 'High cholesterol and prevention of heart disease',
      prescription: true
    },
    {
      id: 15,
      name: 'Telmisartan 40 mg Tablet',
      stripSize: '10 tablets',
      price: 35,
      description: 'An angiotensin receptor blocker (ARB) that relaxes blood vessels and lowers blood pressure.',
      useFor: 'Hypertension and heart protection',
      prescription: true
    },
    {
      id: 16,
      name: 'Amlodipine 5 mg Tablet',
      stripSize: '10 tablets',
      price: 17.50,
      description: 'A calcium channel blocker that eases blood vessel tension and improves blood flow.',
      useFor: 'High blood pressure and angina (chest pain)',
      prescription: true
    },
    {
      id: 17,
      name: 'Levocetirizine 5 mg Tablet',
      stripSize: '10 tablets',
      price: 16,
      description: 'A modern antihistamine with fewer drowsy effects, used to treat allergies.',
      useFor: 'Allergic rhinitis, skin allergies, itching',
      prescription: false
    },
    {
      id: 18,
      name: 'Montelukast 10 mg Tablet',
      stripSize: '10 tablets',
      price: 115,
      description: 'A leukotriene receptor blocker that reduces airway inflammation.',
      useFor: 'Asthma prevention and allergic rhinitis',
      prescription: true
    },
    {
      id: 19,
      name: 'Cetirizine 10 mg Tablet',
      stripSize: '10 tablets',
      price: 17.50,
      description: 'A classic antihistamine for relief from allergies but may cause mild drowsiness.',
      useFor: 'Sneezing, runny nose, and skin allergies',
      prescription: false
    },
    {
      id: 20,
      name: 'Albendazole 400 mg Tablet',
      stripSize: '1 tablet per strip',
      price: 8,
      description: 'A deworming medicine that kills intestinal parasites.',
      useFor: 'Treatment of worm infestations like roundworm, hookworm',
      prescription: true
    },
    {
      id: 21,
      name: 'Iron + Folic Acid Tablet (IFA Red Tablet)',
      stripSize: '30 tablets',
      price: 22.50,
      description: 'Nutritional supplement combining iron and folic acid, essential for blood formation and fetal development.',
      useFor: 'Anemia and prevention of iron/folate deficiency, especially in pregnancy',
      prescription: false
    }
  ];

  const addToCart = (medicine) => {
    setCart([...cart, { ...medicine, quantity: 1 }]);
  };

  const filteredMedicines = medicines.filter(medicine => {
    // First filter by search query
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.useFor.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Then filter by category
    if (activeFilter === 'All' || activeFilter === 'Tablets') {
      return matchesSearch;
    } else if (activeFilter === 'Tonics') {
      return false; // No tonics to show for now
    }
    
    return matchesSearch;
  });

  const filterButtons = ['All', 'Tablets', 'Tonics', 'Filters'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-teal-50 via-health-mint-50 to-health-lavender-50 dark:from-health-navy-900 dark:via-health-navy-800 dark:to-health-lavender-900 pt-20 pb-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/medicines')}
            className="p-2 rounded-xl hover:bg-white/20 transition-smooth mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-health-navy-800 dark:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-health-navy-800 dark:text-white mb-2">
              Search Medicines
            </h1>
            <p className="text-health-navy-600 dark:text-health-navy-300">
              Find and order medicines directly
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-health-navy-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card rounded-2xl border-0 focus:ring-2 focus:ring-health-teal-500"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6">
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
            {filterButtons.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 glass-card rounded-full transition-smooth whitespace-nowrap flex-shrink-0 ${
                  activeFilter === filter 
                    ? 'bg-health-teal-500 text-white' 
                    : 'text-health-navy-700 dark:text-health-navy-200 hover:bg-health-teal-100/50 dark:hover:bg-health-teal-900/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Medicine Cards */}
        <div className="space-y-4 mb-6">
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="glass-card rounded-3xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-health-navy-800 dark:text-white mb-2">
                    {medicine.name}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <p className="text-health-navy-600 dark:text-health-navy-300">
                        <span className="font-medium">Strip size:</span> {medicine.stripSize}
                      </p>
                      <p className="text-xl font-bold text-health-teal-600">
                        ₹{typeof medicine.price === 'number' ? medicine.price.toFixed(2) : medicine.price} per strip
                      </p>
                    </div>
                    {medicine.prescription && (
                      <div className="flex items-start">
                        <span className="inline-block text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
                          Prescription Required
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => addToCart(medicine)}
                  className="px-6 py-3 gradient-primary text-white rounded-xl hover-scale transition-smooth flex items-center space-x-2 ml-4"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <p className="text-health-navy-700 dark:text-health-navy-200 leading-relaxed">
                  <span className="font-medium">Description:</span> {medicine.description}
                </p>
                <p className="text-health-navy-600 dark:text-health-navy-300 italic">
                  <span className="font-medium">Use it for...</span> {medicine.useFor}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        {cart.length > 0 && (
          <div className="glass-card rounded-3xl p-6">
            <h3 className="text-lg font-bold text-health-navy-800 dark:text-white mb-4">
              Cart ({cart.length} items)
            </h3>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/20 rounded-xl">
                  <div>
                    <h4 className="font-medium text-health-navy-800 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-health-navy-600 dark:text-health-navy-300">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-health-teal-600">₹{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-health-navy-200 dark:border-health-navy-600 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-health-navy-800 dark:text-white">Total:</span>
                <span className="text-2xl font-bold text-health-teal-600">
                  ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                </span>
              </div>
              <button className="w-full py-3 gradient-primary text-white rounded-2xl hover-lift transition-smooth">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineSearchPage;