/**
 * SchoolsPedia — Mock/Seed Data
 * Used when schoolspedia.db is not yet available.
 * All functions return the same shape as real DB queries.
 */

export const MOCK_STATES = [
  { state_slug: 'uttar-pradesh',    state_name: 'Uttar Pradesh',     total_schools: 245231, district_count: 75,  block_count: 826,  village_count: 98765 },
  { state_slug: 'madhya-pradesh',   state_name: 'Madhya Pradesh',    total_schools: 132456, district_count: 55,  block_count: 413,  village_count: 54321 },
  { state_slug: 'maharashtra',      state_name: 'Maharashtra',       total_schools: 110234, district_count: 36,  block_count: 358,  village_count: 43210 },
  { state_slug: 'rajasthan',        state_name: 'Rajasthan',         total_schools: 98123,  district_count: 50,  block_count: 352,  village_count: 45678 },
  { state_slug: 'west-bengal',      state_name: 'West Bengal',       total_schools: 89456,  district_count: 23,  block_count: 341,  village_count: 38900 },
  { state_slug: 'karnataka',        state_name: 'Karnataka',         total_schools: 72345,  district_count: 31,  block_count: 236,  village_count: 29876 },
  { state_slug: 'gujarat',          state_name: 'Gujarat',           total_schools: 56789,  district_count: 33,  block_count: 256,  village_count: 18765 },
  { state_slug: 'andhra-pradesh',   state_name: 'Andhra Pradesh',    total_schools: 65432,  district_count: 26,  block_count: 670,  village_count: 28901 },
  { state_slug: 'bihar',            state_name: 'Bihar',             total_schools: 78123,  district_count: 38,  block_count: 534,  village_count: 45600 },
  { state_slug: 'odisha',           state_name: 'Odisha',            total_schools: 58234,  district_count: 30,  block_count: 314,  village_count: 51234 },
  { state_slug: 'jharkhand',        state_name: 'Jharkhand',         total_schools: 41234,  district_count: 24,  block_count: 263,  village_count: 32100 },
  { state_slug: 'himachal-pradesh', state_name: 'Himachal Pradesh',  total_schools: 15432,  district_count: 12,  block_count: 78,   village_count: 19876 },
  { state_slug: 'haryana',          state_name: 'Haryana',           total_schools: 24567,  district_count: 22,  block_count: 140,  village_count: 7356  },
  { state_slug: 'punjab',           state_name: 'Punjab',            total_schools: 19876,  district_count: 23,  block_count: 150,  village_count: 12981 },
  { state_slug: 'tamil-nadu',       state_name: 'Tamil Nadu',        total_schools: 56789,  district_count: 38,  block_count: 385,  village_count: 16317 },
  { state_slug: 'telangana',        state_name: 'Telangana',         total_schools: 34567,  district_count: 33,  block_count: 584,  village_count: 10432 },
  { state_slug: 'kerala',           state_name: 'Kerala',            total_schools: 12345,  district_count: 14,  block_count: 152,  village_count: 1450  },
  { state_slug: 'delhi',            state_name: 'Delhi',             total_schools: 5678,   district_count: 11,  block_count: 27,   village_count: 362   },
  { state_slug: 'chhattisgarh',     state_name: 'Chhattisgarh',      total_schools: 45678,  district_count: 33,  block_count: 149,  village_count: 20334 },
  { state_slug: 'assam',            state_name: 'Assam',             total_schools: 38901,  district_count: 35,  block_count: 219,  village_count: 26395 },
  { state_slug: 'uttarakhand',      state_name: 'Uttarakhand',       total_schools: 16789,  district_count: 13,  block_count: 95,   village_count: 16826 },
  { state_slug: 'jammu-and-kashmir',state_name: 'Jammu & Kashmir',  total_schools: 19234,  district_count: 20,  block_count: 258,  village_count: 6768  },
  { state_slug: 'manipur',          state_name: 'Manipur',           total_schools: 3456,   district_count: 16,  block_count: 74,   village_count: 2639  },
  { state_slug: 'meghalaya',        state_name: 'Meghalaya',         total_schools: 12345,  district_count: 12,  block_count: 39,   village_count: 6861  },
  { state_slug: 'tripura',          state_name: 'Tripura',           total_schools: 4567,   district_count: 8,   block_count: 58,   village_count: 871   },
  { state_slug: 'nagaland',         state_name: 'Nagaland',          total_schools: 2345,   district_count: 16,  block_count: 51,   village_count: 1278  },
  { state_slug: 'mizoram',          state_name: 'Mizoram',           total_schools: 2123,   district_count: 11,  block_count: 26,   village_count: 853   },
  { state_slug: 'arunachal-pradesh',state_name: 'Arunachal Pradesh', total_schools: 3234,   district_count: 26,  block_count: 93,   village_count: 5616  },
  { state_slug: 'sikkim',           state_name: 'Sikkim',            total_schools: 1123,   district_count: 6,   block_count: 19,   village_count: 459   },
  { state_slug: 'goa',              state_name: 'Goa',               total_schools: 1345,   district_count: 2,   block_count: 12,   village_count: 411   },
  { state_slug: 'puducherry',       state_name: 'Puducherry',        total_schools: 789,    district_count: 4,   block_count: 12,   village_count: 96    },
  { state_slug: 'chandigarh',       state_name: 'Chandigarh',        total_schools: 345,    district_count: 1,   block_count: 7,    village_count: 26    },
  { state_slug: 'ladakh',           state_name: 'Ladakh',            total_schools: 789,    district_count: 2,   block_count: 26,   village_count: 219   },
  { state_slug: 'andaman-and-nicobar-islands', state_name: 'Andaman & Nicobar Islands', total_schools: 345, district_count: 3, block_count: 10, village_count: 547 },
  { state_slug: 'dadra-and-nagar-haveli-and-daman-and-diu', state_name: 'Dadra & Nagar Haveli and Daman & Diu', total_schools: 234, district_count: 3, block_count: 10, village_count: 72 },
  { state_slug: 'lakshadweep',      state_name: 'Lakshadweep',       total_schools: 56,     district_count: 1,   block_count: 3,    village_count: 10    },
];

export const MOCK_DISTRICTS_UP = [
  { district_slug: 'lucknow',       district_name: 'Lucknow',       state_slug: 'uttar-pradesh', state_name: 'Uttar Pradesh', total_schools: 15234, block_count: 8,  village_count: 845,  dist_population: 4589838, dist_literacy_pct: 78.5, dist_sex_ratio: 908, dist_avg_lat: 26.8467, dist_avg_long: 80.9462, dist_sample_pin: 226001 },
  { district_slug: 'agra',          district_name: 'Agra',          state_slug: 'uttar-pradesh', state_name: 'Uttar Pradesh', total_schools: 12456, block_count: 15, village_count: 1234, dist_population: 4418797, dist_literacy_pct: 73.0, dist_sex_ratio: 869, dist_avg_lat: 27.1767, dist_avg_long: 78.0081, dist_sample_pin: 282001 },
  { district_slug: 'varanasi',      district_name: 'Varanasi',      state_slug: 'uttar-pradesh', state_name: 'Uttar Pradesh', total_schools: 8967,  block_count: 8,  village_count: 768,  dist_population: 3676841, dist_literacy_pct: 76.8, dist_sex_ratio: 891, dist_avg_lat: 25.3176, dist_avg_long: 82.9739, dist_sample_pin: 221001 },
  { district_slug: 'allahabad',     district_name: 'Prayagraj',     state_slug: 'uttar-pradesh', state_name: 'Uttar Pradesh', total_schools: 13456, block_count: 20, village_count: 2543, dist_population: 5954391, dist_literacy_pct: 72.3, dist_sex_ratio: 896, dist_avg_lat: 25.4358, dist_avg_long: 81.8463, dist_sample_pin: 211001 },
  { district_slug: 'kanpur-nagar',  district_name: 'Kanpur Nagar',  state_slug: 'uttar-pradesh', state_name: 'Uttar Pradesh', total_schools: 7890,  block_count: 10, village_count: 567,  dist_population: 4572951, dist_literacy_pct: 79.6, dist_sex_ratio: 862, dist_avg_lat: 26.4499, dist_avg_long: 80.3319, dist_sample_pin: 208001 },
  { district_slug: 'gorakhpur',     district_name: 'Gorakhpur',     state_slug: 'uttar-pradesh', state_name: 'Uttar Pradesh', total_schools: 11234, block_count: 19, village_count: 2134, dist_population: 4440895, dist_literacy_pct: 71.5, dist_sex_ratio: 932, dist_avg_lat: 26.7606, dist_avg_long: 83.3732, dist_sample_pin: 273001 },
];

export const MOCK_SCHOOLS = [
  {
    udise_code: 9340100101, school_name: 'Govt. Primary School Atrawa',
    state: 'Uttar Pradesh', district: 'Lucknow', block: 'Mohanlalganj', village: 'Atrawa', cluster: 'GSSS Atrawa',
    location: 'Rural', state_mgmt: 'Department of Education', national_mgmt: 'Department of Education',
    school_category: 'Primary', school_type: 'Co-educational', school_status: 'Operational',
    state_slug: 'uttar-pradesh', district_slug: 'lucknow', block_slug: 'mohanlalganj', village_slug: 'atrawa',
    school_slug: 'govt-primary-school-atrawa-9340100101',
    url: '/schools/uttar-pradesh/lucknow/mohanlalganj/atrawa/govt-primary-school-atrawa-9340100101'
  },
  {
    udise_code: 9340100102, school_name: 'Govt. Upper Primary School Atrawa',
    state: 'Uttar Pradesh', district: 'Lucknow', block: 'Mohanlalganj', village: 'Atrawa', cluster: 'GSSS Atrawa',
    location: 'Rural', state_mgmt: 'Department of Education', national_mgmt: 'Department of Education',
    school_category: 'Upper Primary', school_type: 'Co-educational', school_status: 'Operational',
    state_slug: 'uttar-pradesh', district_slug: 'lucknow', block_slug: 'mohanlalganj', village_slug: 'atrawa',
    school_slug: 'govt-upper-primary-school-atrawa-9340100102',
    url: '/schools/uttar-pradesh/lucknow/mohanlalganj/atrawa/govt-upper-primary-school-atrawa-9340100102'
  },
  {
    udise_code: 9340100215, school_name: 'Govt. Primary School Rampur Khurd',
    state: 'Uttar Pradesh', district: 'Lucknow', block: 'Mohanlalganj', village: 'Rampur Khurd', cluster: 'GSSS Atrawa',
    location: 'Rural', state_mgmt: 'Department of Education', national_mgmt: 'Department of Education',
    school_category: 'Primary', school_type: 'Co-educational', school_status: 'Operational',
    state_slug: 'uttar-pradesh', district_slug: 'lucknow', block_slug: 'mohanlalganj', village_slug: 'rampur-khurd',
    school_slug: 'govt-primary-school-rampur-khurd-9340100215',
    url: '/schools/uttar-pradesh/lucknow/mohanlalganj/rampur-khurd/govt-primary-school-rampur-khurd-9340100215'
  },
];

export const MOCK_STATS = {
  total_schools: 1653159, total_states: 36, total_districts: 741, total_villages: 652177
};

export const MOCK_DISTRICT_STATS = {
  district_name: 'Lucknow', total_schools: 15234, block_count: 8,
  dist_population: 4589838, dist_literacy_pct: 78.5, dist_sex_ratio: 908,
  dist_avg_lat: 26.8467, dist_avg_long: 80.9462, dist_sample_pin: 226001,
  dist_male: 2396956, dist_female: 2192882, dist_sc_pct: 20.1, dist_st_pct: 0.4,
  dist_hindus: 3554243, dist_hindu_pct: 77.4, dist_muslims: 989326, dist_muslim_pct: 21.6,
  dist_govt_schools: 11400, dist_private_schools: 3834
};
