import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSchoolBySlug, getNearbySchools, getDistrictStatsForSchool, getSchoolReviewStats } from '@/lib/queries';
import { getSchoolMeta, schoolSchema, breadcrumbSchema, faqSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import DistrictStats from '@/components/DistrictStats';
import SchoolReviews from '@/components/SchoolReviews';
import TableOfContents from '@/components/TableOfContents';
import SchoolActions from '@/components/SchoolActions';

// Cache school pages for 30 days (ISR) — prevents repeated DB queries for every
// Googlebot crawl which was causing 5xx timeouts. Re-validated monthly.
export const revalidate = 2592000;

// Pre-build top schools at build time (rest will ISR on-demand)




import { t } from '@/lib/translate';

export async function getSchoolPageMetadata({ params, lang = 'en' }) {
  const { school: schoolSlug } = await params;
  const school = await Promise.race([
    getSchoolBySlug(schoolSlug).catch(() => null),
    new Promise(resolve => setTimeout(() => resolve(null), 7000))
  ]);
  const slugToTitle = (s) => (s || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const fallback = { school_name: slugToTitle(schoolSlug), school_slug: schoolSlug };
  return getSchoolMeta(school || fallback, lang);
}


export async function generateMetadata(props) {
  return getSchoolPageMetadata({ ...props, lang: 'en' });
}

function getSchoolDescription(school, districtStats, stateSlug, districtSlug, blockSlug, villageSlug, lang = 'en') {
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS';
  const isKV   = school.national_mgmt === 'KVS';
  const isNVS  = school.national_mgmt === 'NVS';

  const pathPrefix = lang === 'hi' ? '/hi' : '';
  const villageLink   = `<a href="${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${school.village}</a>`;
  const blockLink     = `<a href="${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${school.block}</a>`;
  const districtLink  = `<a href="${pathPrefix}/schools/${stateSlug}/${districtSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${t(school.district_slug, lang) || school.district}</a>`;
  const stateLink     = `<a href="${pathPrefix}/schools/${stateSlug}" style="color:#1E40AF;text-decoration:underline;font-weight:600">${t(school.state_slug, lang) || school.state}</a>`;

  const classRange = { 'Primary': lang === 'hi' ? '1 से 5' : '1 to 5', 'Upper Primary': lang === 'hi' ? '6 से 8' : '6 to 8', 'Secondary': lang === 'hi' ? '9 से 10' : '9 to 10', 'Higher Secondary': lang === 'hi' ? '9 से 12' : '9 to 12' }[school.school_category] || (lang === 'hi' ? '1 से 8' : '1 to 8');
  
  let admitsText = school.school_type === 'Boys' ? 'boys only' : school.school_type === 'Girls' ? 'girls only' : 'both boys and girls';
  if (lang === 'hi') {
    admitsText = school.school_type === 'Boys' ? 'केवल बालकों (Boys)' : school.school_type === 'Girls' ? 'केवल बालिकाओं (Girls)' : 'बालक और बालिका दोनों (Co-ed)';
  }

  // Line 1: What is this school, plainly
  let para1 = '';
  if (lang === 'hi') {
    para1 = `**${school.school_name}** ${villageLink} गाँव, ${blockLink} ब्लॉक, ${districtLink} जिला, ${stateLink} में स्थित है।`;
    para1 += ` यहाँ **कक्षा ${classRange}** तक की शिक्षा प्रदान की जाती है और यह ${admitsText} स्कूल है।`;
    if (isKV)  para1 += ` यह एक केंद्रीय विद्यालय (Kendriya Vidyalaya) है — जो केंद्र सरकार द्वारा मुख्य रूप से सरकारी कर्मचारियों के बच्चों के लिए चलाया जाता है।`;
    if (isNVS) para1 += ` यह एक जवाहर नवोदय विद्यालय (Jawahar Navodaya Vidyalaya) है — जो ग्रामीण क्षेत्रों के प्रतिभाशाली बच्चों के लिए पूरी तरह से आवासीय स्कूल है।`;
  } else {
    para1 = `**${school.school_name}** is in ${villageLink} village, ${blockLink} block, ${districtLink} district, ${stateLink}.`;
    para1 += ` It teaches **Class ${classRange}** and admits ${admitsText}.`;
    if (isKV)  para1 += ` This is a Kendriya Vidyalaya — run by the central government, mainly for children of government employees.`;
    if (isNVS) para1 += ` This is a Jawahar Navodaya Vidyalaya — a fully residential school for rural students selected through the JNVST entrance exam.`;
  }

  // Line 2: Cost / fees reality
  let para2 = '';
  if (lang === 'hi') {
    if (isGovt) {
      para2 = `यह एक सरकारी स्कूल है। **यहाँ शिक्षा पूरी तरह से निःशुल्क है।** राज्य सरकार पाठ्यपुस्तकें और मध्याह्न भोजन (PM POSHAN) योजना के तहत पका हुआ गर्म भोजन प्रदान करती है। कोई ट्यूशन फीस नहीं ली जाती है।`;
    } else if (school.national_mgmt === 'Private Aided') {
      para2 = `यह एक निजी सहायता प्राप्त (private-aided) स्कूल है — इसे सरकार से कुछ सहायता मिलती है लेकिन इसका प्रबंधन निजी तौर पर किया जाता है। इसकी फीस आमतौर पर पूरी तरह से निजी स्कूलों की तुलना में कम होती है, लेकिन आपको स्कूल से फीस की पुष्टि करनी चाहिए।`;
    } else {
      para2 = `यह एक निजी गैर-सहायता प्राप्त (private unaided) स्कूल है। यह अपनी प्रबंधन समिति द्वारा निर्धारित ट्यूशन फीस लेता है। शिक्षा के अधिकार (RTE) अधिनियम के तहत, **कक्षा 1 में 25% सीटें** पड़ोस के गरीब परिवारों के बच्चों के लिए मुफ्त आरक्षित होती हैं।`;
    }
  } else {
    if (isGovt) {
      para2 = `This is a government school. **Education here is free.** The state provides textbooks and a cooked meal every school day under the PM POSHAN scheme. No tuition fee is charged.`;
    } else if (school.national_mgmt === 'Private Aided') {
      para2 = `This is a private-aided school — it receives some funding from the government but is managed privately. Fees are usually lower than fully private schools, but you should confirm the current fee structure directly with the school.`;
    } else {
      para2 = `This is a private unaided school. It charges tuition fees set by its own management. Under the RTE Act, **25% of seats in Class 1** must be given free to children from low-income families in the neighbourhood. Ask the school about the current admission process for RTE seats.`;
    }
  }

  // Line 3: Status + district context
  let para3 = '';
  if (lang === 'hi') {
    if (school.school_status !== 'Operational') {
      para3 = `⚠️ **ध्यान दें:** UDISE+ रिकॉर्ड के अनुसार, इस स्कूल की स्थिति **${t(school.school_status, lang)}** दिखाई गई है। कृपया प्रवेश से पहले BEO कार्यालय से जानकारी लें।`;
    } else if (districtStats?.dist_literacy_pct) {
      const lit = districtStats.dist_literacy_pct.toFixed(1);
      const totalSch = districtStats.total_schools ? districtStats.total_schools.toLocaleString('en-IN') : null;
      para3 = `${t(school.district_slug, lang) || school.district} जिले की साक्षरता दर **${lit}%** है${totalSch ? ` और यहाँ ${totalSch} पंजीकृत स्कूल हैं` : ''}।`;
    }
  } else {
    if (school.school_status !== 'Operational') {
      para3 = `⚠️ **Note:** According to UDISE+ records, this school is listed as **${school.school_status}**. Verify with the Block Education Officer (BEO) in ${school.block} before visiting.`;
    } else if (districtStats?.dist_literacy_pct) {
      const lit = districtStats.dist_literacy_pct.toFixed(1);
      const totalSch = districtStats.total_schools ? districtStats.total_schools.toLocaleString('en-IN') : null;
      para3 = `${school.district} district has a literacy rate of **${lit}%**${totalSch ? ` and ${totalSch} registered schools` : ''}.`;
    }
  }

  return [para1, para2, para3].filter(Boolean).join('\n\n');
}

function getRTEContent(school, lang = 'en') {
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS';
  const stateName = school.state;

  const stateRTEPortals = {
    'Uttar Pradesh': 'rte25.upsdc.gov.in',
    'Maharashtra': 'student.maharashtra.gov.in',
    'Rajasthan': 'rajpsp.nic.in',
    'Gujarat': 'rte.orpgujarat.com',
    'Bihar': 'state.bihar.gov.in/educationbihar',
    'Madhya Pradesh': 'rteportal.mp.gov.in',
  };

  const stateRTESchedules = {
    'Uttar Pradesh': lang === 'hi'
      ? 'यूपी आरटीई (RTE) धारा 12(1)(c) प्रवेश प्रक्रिया 3 चरणों में आयोजित की जाती है। ऑनलाइन आवेदन आमतौर पर फरवरी के मध्य से शुरू होते हैं और अप्रैल में समाप्त होते हैं।'
      : 'UP RTE Section 12(1)(c) admissions are conducted in 3 distinct phases. Online applications normally start in mid-February and conclude in April. Registered schools verify and admit students by June.',
    'Maharashtra': 'Maharashtra RTE 25% admission process online registration typically begins in March and closes by April.',
    'Rajasthan': 'Rajasthan RTE admission portals usually invite applications in April. The official lottery selection occurs in May, and document verification runs through June.',
    'Gujarat': 'Gujarat RTE admission online portals start registering candidates in early March. Verification of parents\' documents occurs at local help centers in April.',
    'Madhya Pradesh': lang === 'hi'
      ? 'एमपी आरटीई (MP RTE) प्रवेश प्रक्रिया मार्च से शुरू होती है। जिला शिक्षा केंद्र पर दस्तावेज़ सत्यापन अप्रैल की शुरुआत में होता है, जिसके बाद ऑनलाइन लॉटरी द्वारा सीटें दी जाती हैं।'
      : 'MP RTE portal registration starts in March. Document verification at public service centers (Jila Shiksha Kendra) occurs in early April, followed by online lottery seats distribution.',
    'Bihar': lang === 'hi'
      ? 'बिहार में आरटीई एडमिशन के लिए शिक्षा विभाग के पोर्टल के माध्यम से मार्च-अप्रैल के दौरान आवेदन किया जाता है।'
      : 'Timeline for RTE admissions in Bihar generally runs from March to June. Please check the official state education website for active deadlines.',
  };

  const portal = stateRTEPortals[stateName] || `${stateName.toLowerCase().replace(/ /g, '')}.gov.in`;
  const schedule = stateRTESchedules[stateName] || (lang === 'hi' ? `आरटीई प्रवेश की समयसीमा आमतौर पर मार्च से जून तक चलती है। सटीक जानकारी के लिए आधिकारिक राज्य शिक्षा वेबसाइट देखें।` : `Timeline for RTE admissions in ${stateName} generally runs from March to June. Please check the official state education website for active deadlines.`);

  const stepsHi = [
    `अपने नजदीकी स्कूल की खोज करें — SchoolsPedia का उपयोग करके ${t(school.district_slug, lang) || school.district} जिले में अपने गाँव या पिन कोड के अनुसार खोजें।`,
    `अपने दस्तावेज़ तैयार करें — बच्चे का जन्म प्रमाण पत्र, बच्चे और माता-पिता का आधार कार्ड, निवास प्रमाण पत्र (राशन कार्ड / बिजली बिल / आधार), और 2 पासपोर्ट साइज फोटो।`,
    `ऑनलाइन या सीधे स्कूल में आवेदन करें — आधिकारिक RTE पोर्टल ${portal} पर जाएं या अप्रैल-जून के प्रवेश सत्र के दौरान सीधे स्कूल में आवेदन पत्र जमा करें।`,
    `ब्लॉक शिक्षा अधिकारी (BEO) से संपर्क करें — किसी भी शिकायत या सहायता के लिए BEO ${school.block} से संपर्क करें।`,
  ];

  const stepsEn = [
    `Find your nearest government school — Use SchoolsPedia to search by your village or PIN code in ${school.district}.`,
    `Prepare your documents — Birth certificate of the child, Aadhaar card of child and parent, residence proof (ration card / Aadhaar), 2 passport-size photographs.`,
    `Apply online — Visit ${portal} or apply directly at the school during April–June admission season.`,
    `Contact Block Education Officer (BEO) — For disputes, RTE violations, or seat issues, contact BEO ${school.block}.`,
  ];

  const rteQuotaHi = `आरटीई अधिनियम की धारा 12(1)(c) के तहत, ${school.village} गाँव के 1 किमी के दायरे में आने वाले सभी निजी स्कूलों में प्रवेश स्तर की कक्षा में 25% सीटें आर्थिक रूप से कमजोर वर्ग (EWS) के बच्चों के लिए आरक्षित होनी चाहिए।`;
  const rteQuotaEn = `Private schools within 1 km of ${school.village} are required under RTE Section 12(1)(c) to reserve 25% seats for children from Economically Weaker Sections (EWS).`;

  return {
    isGovt,
    portal,
    schedule,
    stepsGovt: lang === 'hi' ? stepsHi : stepsEn,
    rteQuota: lang === 'hi' ? rteQuotaHi : rteQuotaEn,
  };
}

function getUDISEBreakdown(udise, lang = 'en') {
  const code = String(udise).padStart(11, '0');
  return [
    { digits: code.slice(0, 2), label: lang === 'hi' ? 'राज्य कोड' : 'State code', sub: '' },
    { digits: code.slice(2, 4), label: lang === 'hi' ? 'जिला कोड' : 'District code', sub: '' },
    { digits: code.slice(4, 6), label: lang === 'hi' ? 'ब्लॉक कोड' : 'Block code', sub: '' },
    { digits: code.slice(6, 9), label: lang === 'hi' ? 'क्लस्टर कोड' : 'Cluster code', sub: '' },
    { digits: code.slice(9),    label: lang === 'hi' ? 'स्कूल क्रमांक' : 'School serial', sub: '' },
  ];
}

function getSchoolFAQs(school, districtStats, lang = 'en') {
  const n   = school.school_name;
  const v   = school.village;
  const d   = t(school.district_slug, lang) || school.district;
  const b   = school.block;
  const st  = t(school.state_slug, lang) || school.state;
  const u   = school.udise_code;
  const cat = t(school.school_category, lang);
  const classRange = { 'Primary': lang === 'hi' ? '1 से 5' : '1 to 5', 'Upper Primary': lang === 'hi' ? '6 से 8' : '6 to 8', 'Secondary': lang === 'hi' ? '9 से 10' : '9 to 10', 'Higher Secondary': lang === 'hi' ? '11 to 12' : '11 to 12' }[school.school_category] || (lang === 'hi' ? '1 से 8' : '1 to 8');
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS' || school.national_mgmt?.includes('Local Body');
  const isClosed = school.school_status !== 'Operational';

  if (lang === 'hi') {
    return [
      {
        q: `${n} का UDISE कोड क्या है?`,
        a: `इस स्कूल का UDISE कोड **${String(u).padStart(11, '0')}** है। यह 11-अंकों का विशिष्ट कोड है जिसकी आवश्यकता आपको छात्रवृत्ति (NSP), स्कूल ट्रांसफर सर्टिफिकेट और बोर्ड परीक्षा पंजीकरण फॉर्म में होगी।`
      },
      {
        q: `क्या ${n} एक सरकारी स्कूल है या निजी?`,
        a: isGovt
          ? `यह एक सरकारी स्कूल है। यहाँ शिक्षा बिल्कुल मुफ्त है — कोई ट्यूशन फीस नहीं ली जाती। सरकारी नियमों के अनुसार छात्रों को निःशुल्क पाठ्यपुस्तकें और मध्याह्न भोजन (PM POSHAN) मिलता है।`
          : `यह एक निजी (Private) स्कूल है। इसकी फीस प्रबंधन द्वारा तय की जाती है। हालांकि, RTE अधिनियम के तहत, इसमें गरीब परिवारों के बच्चों के लिए 25% सीटें आरक्षित हैं।`
      },
      {
        q: `${n} में कौन सी कक्षाएं पढ़ाई जाती हैं?`,
        a: `यह एक **${cat}** स्कूल है, जहाँ कक्षा **${classRange}** तक की पढ़ाई होती है। ${school.school_category === 'Primary' ? `इसके बाद की पढ़ाई के लिए छात्र आमतौर पर ${b} क्षेत्र के उच्च प्राथमिक या माध्यमिक स्कूलों में जाते हैं।` : ''}`
      },
      {
        q: `${n} कहाँ स्थित है?`,
        a: `यह ${v} गाँव, ${b} ब्लॉक, ${d} जिला, ${st} में स्थित है।`
      },
      {
        q: `क्या ${n} अभी सक्रिय है और प्रवेश ले रहा है?`,
        a: isClosed
          ? `सरकारी UDISE+ रिकॉर्ड के अनुसार, इस स्कूल की स्थिति **${t(school.school_status, lang)}** दिखाई गई है। कृपया प्रवेश से पहले अपने ब्लॉक शिक्षा अधिकारी से जानकारी लें।`
          : `यह स्कूल UDISE+ रिकॉर्ड में **सक्रिय (Operational)** है। प्रवेश संबंधी जानकारी के लिए सीधे स्कूल का दौरा करें या BEO कार्यालय से संपर्क करें।`
      },
      {
        q: `${n} में क्या-क्या सुविधाएँ उपलब्ध हैं?`,
        a: `वर्तमान डेटासेट में इस स्कूल की सुविधाओं (जैसे पुस्तकालय, कंप्यूटर, शौचालय आदि) का विस्तृत विवरण उपलब्ध नहीं है। स्कूल के Report Card की जांच करने के लिए UDISE कोड **${String(u).padStart(11, '0')}** के साथ आधिकारिक **udiseplus.gov.in** पोर्टल पर जाएं या सीधे स्कूल जाकर सुविधाओं की पुष्टि करें।`
      }
    ];
  }

  return [
    {
      q: `What is the UDISE code of ${n}?`,
      a: `The UDISE code is **${String(u).padStart(11, '0')}**. You'll need this number for NSP scholarship forms, school transfer certificates, and board exam registrations.`
    },
    {
      q: `Is ${n} a government school or private?`,
      a: isGovt
        ? `It's a government school. Education is free — no tuition fee. The state provides textbooks and a cooked mid-day meal every school day.`
        : `It's a private school. Fees are set by its own management. Under the RTE Act, 25% of entry-class seats must be given free to children from low-income families in the neighbourhood.`
    },
    {
      q: `Which classes does ${n} teach?`,
      a: `It's a **${cat}** school — it teaches Class **${classRange}**. ${school.school_category === 'Primary' ? `For middle school or high school, students from ${v} usually go to a school in the ${b} area.` : ''}`
    },
    {
      q: `Where is ${n} located?`,
      a: `${v} village, ${b} block, ${d} district, ${st}.`
    },
    {
      q: `Is ${n} open and taking admissions?`,
      a: isClosed
        ? `UDISE+ records show this school as **${school.school_status}**. Check with the Block Education Officer (BEO) in ${b} to confirm the current situation.`
        : `The school is listed as **Operational** in UDISE+ records. For admissions, visit the school directly or contact the BEO office in **${b} block**.`
    },
    {
      q: `How do I check the facilities at ${n}?`,
      a: `We don't have detailed facility data for this school in our current dataset. For toilets, drinking water, electricity, and other infrastructure details, download the school's free Report Card from **udiseplus.gov.in** using UDISE code **${String(u).padStart(11, '0')}**. You can also visit the school to check in person.`
    }
  ];
}

const FACILITIES = [
  { icon: '🚪', label: 'Classrooms',   key: 'classrooms' },
  { icon: '💧', label: 'Drinking Water', key: 'water' },
  { icon: '🚻', label: 'Boys Toilet',  key: 'boys_toilet' },
  { icon: '🚺', label: 'Girls Toilet', key: 'girls_toilet' },
  { icon: '⚡', label: 'Electricity',  key: 'electricity' },
  { icon: '📚', label: 'Library',      key: 'library' },
  { icon: '🏃', label: 'Playground',   key: 'playground' },
  { icon: '🍲', label: 'Mid-Day Meal', key: 'mdm' },
  { icon: '💻', label: 'Computer Lab', key: 'computer' },
];

function getFacilityStatus(school, key, lang = 'en') {
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body') || school.national_mgmt === 'KVS' || school.national_mgmt === 'NVS';
  const hasDbColumns = school.has_library !== undefined;

  const labels = lang === 'hi' ? {
    provided: 'प्रदान किया जाता है',
    notProvided: 'उपलब्ध नहीं',
    available: 'उपलब्ध',
    notAvailable: 'उपलब्ध नहीं',
    functional: 'कार्यात्मक',
    checkPortal: 'UDISE+ पोर्टल देखें',
    providedGovt: 'प्रदान किया जाता है (सरकारी)'
  } : {
    provided: 'Provided',
    notProvided: 'Not Provided',
    available: 'Available',
    notAvailable: 'Not Available',
    functional: 'Functional',
    checkPortal: 'Check UDISE+',
    providedGovt: 'Provided (Govt)'
  };

  // If actual DB columns exist, use them
  if (hasDbColumns) {
    if (key === 'mdm')        return isGovt ? { status: 'available', label: labels.provided } : { status: 'not_available', label: labels.notProvided };
    if (key === 'electricity') return school.has_electricity === 1 ? { status: 'available', label: labels.available } : { status: 'not_available', label: labels.notAvailable };
    if (key === 'library')     return school.has_library === 1 ? { status: 'available', label: labels.available } : { status: 'not_available', label: labels.notAvailable };
    if (key === 'computer')    return school.has_computers === 1 ? { status: 'available', label: labels.available } : { status: 'not_available', label: labels.notAvailable };
    
    if (key === 'playground') {
      const p = school.has_playground;
      const isAvailable = p && (String(p).includes('1-Yes') || String(p) === '1');
      return isAvailable ? { status: 'available', label: labels.available } : { status: 'not_available', label: labels.notAvailable };
    }
    if (key === 'internet') {
      const inet = school.has_internet;
      const isAvailable = inet && (String(inet).includes('1-Yes') || String(inet) === '1');
      return isAvailable ? { status: 'available', label: labels.available } : { status: 'not_available', label: labels.notAvailable };
    }
    
    if (key === 'boys_toilet') {
      const c = school.boys_toilets_count || 0;
      if (c > 0) return { status: 'available', label: `${c} ${labels.functional}` };
      if (school.has_toilet === 1) return { status: 'available', label: labels.available };
      return { status: 'not_available', label: labels.notAvailable };
    }
    if (key === 'girls_toilet') {
      const c = school.girls_toilets_count || 0;
      if (c > 0) return { status: 'available', label: `${c} ${labels.functional}` };
      if (school.has_toilet === 1) return { status: 'available', label: labels.available };
      return { status: 'not_available', label: labels.notAvailable };
    }
    
    // classrooms assumed present if school is operational
    return { status: 'verify', label: labels.checkPortal };
  }

  // No facility columns in DB — do NOT fabricate. Only assert mid-day meal for govt schools.
  if (key === 'mdm') return isGovt ? { status: 'available', label: labels.providedGovt } : { status: 'not_available', label: labels.notProvided };
  return { status: 'verify', label: labels.checkPortal };
}

const udiseColors = ['#EFF6FF', '#F0FDFA', '#FFF7ED', '#F5F3FF', '#FFF1F2'];
const udiseTextColors = ['#1E40AF', '#0D9488', '#F97316', '#7C3AED', '#BE123C'];

function cleanEmail(email) {
  if (!email) return '';
  let cleaned = email
    .replace(/\[at\]/gi, '@')
    .replace(/\[dot\]/gi, '.')
    .replace(/\s+/g, '')
    .trim();
  if (cleaned.endsWith('.cm')) {
    cleaned = cleaned.replace(/\.cm$/, '.com');
  }
  return cleaned;
}

export default async function SchoolPage({ params, lang = 'en' }) {
  const { state: stateSlug, district: districtSlug, block: blockSlug, village: villageSlug, school: schoolSlug } = await params;

  // 7-second timeout on primary school lookup — prevents entire page from stalling
  // if CockroachDB is slow for a specific school's slug/UDISE lookup
  const schoolRaw = await Promise.race([
    getSchoolBySlug(schoolSlug).catch(() => null),
    new Promise(resolve => setTimeout(() => resolve(null), 7000))
  ]);
  const slugToTitle = (s) => (s || '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const school = schoolRaw || {
    udise_code: 27190000000,
    school_name: slugToTitle(schoolSlug),
    village: slugToTitle(villageSlug),
    village_slug: villageSlug,
    block: slugToTitle(blockSlug),
    block_slug: blockSlug,
    district: slugToTitle(districtSlug),
    district_slug: districtSlug,
    state: slugToTitle(stateSlug),
    state_slug: stateSlug,
    school_category: 'Primary',
    school_type: 'Co-educational',
    national_mgmt: 'Department of Education',
    school_status: 'Operational',
    url: `/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}/${schoolSlug}`,
    school_slug: schoolSlug,
  };


  // Wrap each query in a 6s individual timeout so a single slow query
  // never kills the entire page render (prevents 5xx/timeout errors)
  function withTimeout(promise, ms = 6000, fallback = null) {
    return Promise.race([
      promise,
      new Promise(resolve => setTimeout(() => resolve(fallback), ms))
    ]);
  }

  const [nearby, districtStats, reviewStats] = await Promise.all([
    withTimeout(getNearbySchools(stateSlug, districtSlug, blockSlug, villageSlug, school.udise_code, 6), 5000, []),
    withTimeout(getDistrictStatsForSchool(stateSlug, districtSlug), 5000, null),
    withTimeout(getSchoolReviewStats(school.udise_code), 4000, null),
  ]);


  const faqs = getSchoolFAQs(school, districtStats, lang);
  const rte  = getRTEContent(school, lang);
  const udiseBreakdown = getUDISEBreakdown(school.udise_code, lang);

  const schoolJsonLd = schoolSchema(school, districtStats, reviewStats);
  const pathPrefix = lang === 'hi' ? '/hi' : '';

  const crumbJsonLd  = breadcrumbSchema([
    { name: t('Home', lang), url: '/' },
    { name: t(school.state_slug, lang) || school.state, url: `${pathPrefix}/schools/${stateSlug}` },
    { name: t(school.district_slug, lang) || school.district, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}` },
    { name: school.block, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
    { name: school.village, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
    { name: school.school_name, url: `${pathPrefix}${school.url}` },
  ]);
  const faqJsonLd = faqSchema(faqs);

  const isOperational = school.school_status === 'Operational';
  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';

  const jumpLinks = lang === 'hi' ? [
    { label: 'प्रोफ़ाइल', id: 'overview', icon: '🏫' },
    { label: 'स्थान', id: 'location-info', icon: '📍' },
    { label: 'शैक्षणिक', id: 'academic-info', icon: '📖' },
    { label: 'विवरण', id: 'about', icon: '📝' },
    { label: 'UDISE विश्लेषण', id: 'udise', icon: '🔢' },
    { label: 'सुविधाएँ', id: 'infrastructure', icon: '🏢' },
    { label: 'प्रवेश (RTE)', id: 'admissions', icon: '🎒' },
    { label: 'समीक्षाएँ', id: 'reviews', icon: '⭐' },
    { label: 'FAQs', id: 'faqs', icon: '❓' }
  ] : [
    { label: 'Profile', id: 'overview', icon: '🏫' },
    { label: 'Location', id: 'location-info', icon: '📍' },
    { label: 'Academic Info', id: 'academic-info', icon: '📖' },
    { label: 'Overview', id: 'about', icon: '📝' },
    { label: 'UDISE Breakdown', id: 'udise', icon: '🔢' },
    { label: 'Facilities', id: 'infrastructure', icon: '🏢' },
    { label: 'Admissions & RTE', id: 'admissions', icon: '🎒' },
    { label: 'Reviews', id: 'reviews', icon: '⭐' },
    { label: 'FAQs', id: 'faqs', icon: '❓' }
  ];

  const stateName = t(school.state_slug, lang) || slugToTitle(school.state);
  const districtName = t(school.district_slug, lang) || slugToTitle(school.district);

  const FACILITIES_LOCALIZED = [
    { icon: '🚪', label: lang === 'hi' ? 'कक्षाएँ' : 'Classrooms',   key: 'classrooms' },
    { icon: '💧', label: lang === 'hi' ? 'पेयजल' : 'Drinking Water', key: 'water' },
    { icon: '🚻', label: lang === 'hi' ? 'छात्र शौचालय' : 'Boys Toilet',  key: 'boys_toilet' },
    { icon: '🚺', label: lang === 'hi' ? 'छात्रा शौचालय' : 'Girls Toilet', key: 'girls_toilet' },
    { icon: '⚡', label: lang === 'hi' ? 'बिजली' : 'Electricity',  key: 'electricity' },
    { icon: '📚', label: lang === 'hi' ? 'पुस्तकालय' : 'Library',      key: 'library' },
    { icon: '🏃', label: lang === 'hi' ? 'खेल का मैदान' : 'Playground',   key: 'playground' },
    { icon: '🌐', label: lang === 'hi' ? 'इंटरनेट' : 'Internet',        key: 'internet' },
    { icon: '🍲', label: lang === 'hi' ? 'मध्याह्न भोजन' : 'Mid-Day Meal', key: 'mdm' },
    { icon: '💻', label: lang === 'hi' ? 'कंप्यूटर लैब' : 'Computer Lab', key: 'computer' },
  ];

  return (
    <>
      {/* Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* Breadcrumb */}
      <BreadcrumbNav items={[
        { label: t('Home', lang), href: '/' },
        { label: stateName, href: `${pathPrefix}/schools/${stateSlug}` },
        { label: districtName, href: `${pathPrefix}/schools/${stateSlug}/${districtSlug}` },
        { label: school.block, href: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
        { label: school.village, href: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
        { label: school.school_name },
      ]} />

      {/* Page Header */}
      <div style={{ background: '#1E40AF', padding: '24px 24px 20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isOperational ? '#10B981' : '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>
            {isOperational ? (lang === 'hi' ? '✅ सक्रिय (Operational)' : '✅ OPERATIONAL') : (lang === 'hi' ? '⚠️ बंद (Closed)' : '⚠️ CLOSED')}
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: 10 }}>
            {school.school_name}
            {school.village && districtName && (
              <span style={{ display: 'block', fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', fontWeight: 400, color: '#93C5FD', marginTop: 4 }}>
                {lang === 'hi'
                  ? `${t(school.school_category, lang)} स्कूल · ${school.village}, ${districtName}`
                  : `${school.school_category} School · ${school.village}, ${districtName}`
                }
              </span>
            )}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: '0.8rem', color: '#93C5FD' }}>
            <span>UDISE: <strong style={{ fontFamily: 'var(--font-mono), monospace', color: '#BAE6FD' }}>{String(school.udise_code).padStart(11, '0')}</strong></span>
            <span style={{ color: '#475569' }}>·</span>
            <span>📍 {school.village}, {school.block}, {districtName}, {stateName}</span>
            <span style={{ color: '#475569' }}>·</span>
            <span>🏫 {t(school.school_category, lang)} · {t(school.school_type, lang)} · {t(school.national_mgmt, lang)}</span>
            {reviewStats && reviewStats.count > 0 && (
              <>
                <span style={{ color: '#475569' }}>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#F59E0B', color: '#1E293B', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: 99 }}>
                  ⭐ {reviewStats.avgRating} ({reviewStats.count} {lang === 'hi' ? 'समीक्षा' : (reviewStats.count === 1 ? 'review' : 'reviews')})
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px' }}>
        <div className="school-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, alignItems: 'start' }}>

          {/* ── MAIN COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* School Info Summary Paragraph */}
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.7, margin: '0 0 4px 0' }}>
              {lang === 'hi' ? (
                <>
                  <strong>{school.school_name}</strong> {stateName} के {districtName} जिले में {school.village} गाँव का एक {t(school.school_category, lang)} स्कूल है। UDISE: <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>{String(school.udise_code).padStart(11, '0')}</strong> · {t(school.school_type, lang)} · {t(school.national_mgmt, lang)} · {t(school.school_status, lang)}
                </>
              ) : (
                <>
                  <strong>{school.school_name}</strong> is a {school.school_category} school in {school.village}, {school.district}, {school.state}.
                  UDISE: <strong style={{ fontFamily: 'var(--font-mono), monospace' }}>{String(school.udise_code).padStart(11, '0')}</strong> · {school.school_type} · {school.national_mgmt} · {school.school_status}
                </>
              )}
            </p>

            {/* Table of Contents — Quick Jump Navigation Card (Placed below first paragraph) */}
            <TableOfContents jumpLinks={jumpLinks} lang={lang} />

            {/* Card 1: School Profile */}
            <div id="overview" className="card">
              <div className="card-header">
                <span style={{ fontSize: 18 }}>🏫</span>
                <span>{lang === 'hi' ? 'स्कूल प्रोफ़ाइल' : 'School Profile'}</span>
              </div>
              <div className="card-body">
                <table className="info-table">
                  <tbody>
                    <tr><td>{lang === 'hi' ? 'स्कूल का नाम' : 'School Name'}</td><td><strong>{school.school_name}</strong></td></tr>
                    <tr><td>{lang === 'hi' ? 'UDISE कोड' : 'UDISE Code'}</td><td><span className="udise-pill">{String(school.udise_code).padStart(11, '0')}</span></td></tr>
                    {school.headmaster_name && (
                      <tr>
                        <td>{lang === 'hi' ? 'प्रधानाध्यापक' : 'Headmaster'}</td>
                        <td><strong>{school.headmaster_name}</strong> <span style={{ color: '#10B981', marginLeft: 4 }}>✅</span></td>
                      </tr>
                    )}
                    <tr><td>{lang === 'hi' ? 'स्थिति' : 'Status'}</td><td><span className={`badge ${isOperational ? 'badge-green' : 'badge-red'}`}>{isOperational ? (lang === 'hi' ? '✅ सक्रिय (Operational)' : '✅ Operational') : (lang === 'hi' ? '⚠️ बंद (Closed)' : '⚠️ Closed')}</span></td></tr>
                    <tr><td>{lang === 'hi' ? 'प्रबंधन' : 'Management'}</td><td>{t(school.national_mgmt, lang)}</td></tr>
                    {school.establishment_year && (
                      <tr>
                        <td>{lang === 'hi' ? 'स्थापना वर्ष' : 'Establishment Year'}</td>
                        <td>{school.establishment_year}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {school.last_updated && (
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'right', marginTop: 8 }}>
                    {lang === 'hi' ? `अंतिम अपडेट: ${school.last_updated}` : `Last Updated: ${school.last_updated}`}
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Location & Address */}
            <div id="location-info" className="card">
              <div className="card-header">
                <span style={{ fontSize: 18 }}>📍</span>
                <span>{lang === 'hi' ? 'प्रशासनिक स्थान और पता' : 'Location & Address'}</span>
              </div>
              <div className="card-body">
                <table className="info-table">
                  <tbody>
                    <tr><td>{lang === 'hi' ? 'राज्य' : 'State'}</td><td><Link href={`${pathPrefix}/schools/${stateSlug}`} style={{ color: '#1E40AF', textDecoration: 'underline', fontWeight: 600 }}>{stateName}</Link></td></tr>
                    <tr><td>{lang === 'hi' ? 'जिला' : 'District'}</td><td><Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}`} style={{ color: '#1E40AF', textDecoration: 'underline', fontWeight: 600 }}>{districtName}</Link></td></tr>
                    <tr><td>{lang === 'hi' ? 'ब्लॉक' : 'Block'}</td><td><Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}`} style={{ color: '#1E40AF', textDecoration: 'underline', fontWeight: 600 }}>{school.block}</Link></td></tr>
                    <tr><td>{lang === 'hi' ? 'गाँव' : 'Village'}</td><td><Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}`} style={{ color: '#1E40AF', textDecoration: 'underline', fontWeight: 600 }}>{school.village}</Link></td></tr>
                    {school.cluster && (
                      <tr>
                        <td>{lang === 'hi' ? 'क्लस्टर' : 'Cluster'}</td>
                        <td>{school.cluster}</td>
                      </tr>
                    )}
                    <tr><td>{lang === 'hi' ? 'क्षेत्र' : 'Location Type'}</td><td><span className={`badge ${school.location === 'Rural' ? 'badge-green' : 'badge-blue'}`}>{school.location === 'Rural' ? (lang === 'hi' ? '🌿 ग्रामीण' : '🌿 Rural') : (lang === 'hi' ? '🏙️ शहरी' : '🏙️ Urban')}</span></td></tr>
                    {(school.pincode || districtStats?.dist_sample_pin) && (
                      <tr>
                        <td>{lang === 'hi' ? 'पिन कोड' : 'PIN Code'}</td>
                        <td>{school.pincode || districtStats.dist_sample_pin}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 3: Academic Details */}
            <div id="academic-info" className="card">
              <div className="card-header">
                <span style={{ fontSize: 18 }}>📖</span>
                <span>{lang === 'hi' ? 'शैक्षणिक विवरण' : 'Academic Information'}</span>
              </div>
              <div className="card-body">
                <table className="info-table">
                  <tbody>
                    <tr><td>{lang === 'hi' ? 'श्रेणी' : 'Category'}</td><td><span className="badge badge-blue">{t(school.school_category, lang)}</span></td></tr>
                    <tr><td>{lang === 'hi' ? 'स्कूल का प्रकार' : 'School Type'}</td><td><span className="badge badge-teal">{t(school.school_type, lang)}</span></td></tr>
                    {school.medium_of_instruction && (
                      <tr>
                        <td>{lang === 'hi' ? 'शिक्षा का माध्यम' : 'Medium of Instruction'}</td>
                        <td>{school.medium_of_instruction}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact & Communication Card */}
            {(school.address || school.email || school.phone || school.website) && (
              <div id="contact-info" className="card">
                <div className="card-header">
                  <span style={{ fontSize: 18 }}>📞</span>
                  <span>{lang === 'hi' ? 'सम्पर्क और विवरण' : 'Contact & Details'}</span>
                </div>
                <div className="card-body">
                  <table className="info-table">
                    <tbody>
                      {school.address && (
                        <tr>
                          <td>{lang === 'hi' ? 'पता' : 'Address'}</td>
                          <td style={{ lineHeight: 1.5 }}>{school.address}</td>
                        </tr>
                      )}
                      {school.email && (
                        <tr>
                          <td>{lang === 'hi' ? 'ईमेल' : 'Email'}</td>
                          <td><a href={`mailto:${cleanEmail(school.email)}`} style={{ color: '#1E40AF', textDecoration: 'underline' }}>{cleanEmail(school.email)}</a></td>
                        </tr>
                      )}
                      {school.phone && (
                        <tr>
                          <td>{lang === 'hi' ? 'फोन नंबर' : 'Phone'}</td>
                          <td><a href={`tel:${school.phone}`} style={{ color: '#1E40AF', textDecoration: 'underline' }}>{school.phone}</a></td>
                        </tr>
                      )}
                      {school.website && (
                        <tr>
                          <td>{lang === 'hi' ? 'वेबसाइट' : 'Website'}</td>
                          <td><a href={school.website.startsWith('http') ? school.website : `https://${school.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1E40AF', textDecoration: 'underline', fontWeight: 600 }}>{school.website}</a></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Student & Teacher Statistics Card */}
            {(school.total_students > 0 || school.total_teachers > 0) && (
              <div id="school-stats" className="card">
                <div className="card-header">
                  <span style={{ fontSize: 18 }}>📊</span>
                  <span>{lang === 'hi' ? 'छात्र और शिक्षक आंकड़े' : 'Student & Teacher Statistics'}</span>
                </div>
                <div className="card-body" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    
                    {/* Students Stats */}
                    {school.total_students > 0 && (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
                          👨‍🎓 {lang === 'hi' ? 'कुल छात्र' : 'Total Students'}
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginBottom: 10 }}>
                          {school.total_students}
                        </div>
                        {(school.boys > 0 || school.girls > 0) && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#475569', marginBottom: 4 }}>
                              <span>{lang === 'hi' ? `बालक: ${school.boys}` : `Boys: ${school.boys}`}</span>
                              <span>{lang === 'hi' ? `बालिकाएं: ${school.girls}` : `Girls: ${school.girls}`}</span>
                            </div>
                            <div style={{ width: '100%', height: 8, background: '#EFF6FF', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
                              <div style={{ width: `${(school.boys / school.total_students) * 100}%`, height: '100%', background: '#3B82F6' }} />
                              <div style={{ width: `${(school.girls / school.total_students) * 100}%`, height: '100%', background: '#EC4899' }} />
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>
                              {lang === 'hi' ? `${((school.boys / school.total_students) * 100).toFixed(0)}% बालक · ${((school.girls / school.total_students) * 100).toFixed(0)}% बालिकाएं` : `${((school.boys / school.total_students) * 100).toFixed(0)}% Boys · ${((school.girls / school.total_students) * 100).toFixed(0)}% Girls`}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Teachers Stats */}
                    {school.total_teachers > 0 && (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 14 }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>
                          👩‍🏫 {lang === 'hi' ? 'कुल शिक्षक' : 'Total Teachers'}
                        </div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginBottom: 10 }}>
                          {school.total_teachers}
                        </div>
                        {(school.male_teachers !== null || school.female_teachers !== null) && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#475569', marginBottom: 4 }}>
                              <span>{lang === 'hi' ? `पुरुष: ${school.male_teachers || 0}` : `Male: ${school.male_teachers || 0}`}</span>
                              <span>{lang === 'hi' ? `महिला: ${school.female_teachers || 0}` : `Female: ${school.female_teachers || 0}`}</span>
                            </div>
                            <div style={{ width: '100%', height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', display: 'flex' }}>
                              <div style={{ width: `${((school.male_teachers || 0) / school.total_teachers) * 100}%`, height: '100%', background: '#6366F1' }} />
                              <div style={{ width: `${((school.female_teachers || 0) / school.total_teachers) * 100}%`, height: '100%', background: '#8B5CF6' }} />
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>
                              {lang === 'hi' ? `${(((school.male_teachers || 0) / school.total_teachers) * 100).toFixed(0)}% पुरुष · ${(((school.female_teachers || 0) / school.total_teachers) * 100).toFixed(0)}% महिला` : `${(((school.male_teachers || 0) / school.total_teachers) * 100).toFixed(0)}% Male · ${(((school.female_teachers || 0) / school.total_teachers) * 100).toFixed(0)}% Female`}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Student-Teacher Ratio */}
                  {school.total_students > 0 && school.total_teachers > 0 && (
                    <div style={{ marginTop: 14, background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>💡</span>
                      <p style={{ fontSize: '0.8rem', color: '#065F46', margin: 0 }}>
                        {lang === 'hi' ? (
                          <><strong>छात्र-शिक्षक अनुपात (PTR):</strong> इस स्कूल में हर <strong>{(school.total_students / school.total_teachers).toFixed(0)} छात्रों</strong> पर 1 शिक्षक कार्यरत है, जो व्यक्तिगत ध्यान देने के लिए {school.total_students / school.total_teachers <= 30 ? 'बहुत अच्छा' : 'सामान्य'} है (आरटीई मानक: 30:1)।</>
                        ) : (
                          <><strong>Student-Teacher Ratio (PTR):</strong> There is 1 teacher for every <strong>{(school.total_students / school.total_teachers).toFixed(0)} students</strong> in this school, which is {school.total_students / school.total_teachers <= 30 ? 'excellent' : 'reasonable'} for personalized attention (RTE Standard is 30:1).</>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ad */}
            <AdSlot size="responsive" />

            {/* About Section */}
            <div id="about" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                📖 {lang === 'hi' ? `${school.school_name} के बारे में` : `About ${school.school_name}`}
              </h2>
              {getSchoolDescription(school, districtStats, stateSlug, districtSlug, blockSlug, villageSlug, lang).split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.8, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              ))}
              {(school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body')) && (
                <div className="highlight-box">
                  {lang === 'hi' ? (
                    <p><strong>मध्याह्न भोजन (PM POSHAN):</strong> सरकारी स्कूल हर स्कूल दिन छात्रों को पका हुआ भोजन प्रदान करते हैं। यह मुफ़्त है और इसके लिए किसी आवेदन की आवश्यकता नहीं है।</p>
                  ) : (
                    <p><strong>Mid-Day Meal (PM POSHAN):</strong> Government schools provide a cooked meal to students every school day. This is free and does not require any application.</p>
                  )}
                </div>
              )}
            </div>

            {/* UDISE Code Breakdown */}
            <div id="udise" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                🔢 {lang === 'hi' ? `UDISE कोड — ${String(school.udise_code).padStart(11, '0')}` : `UDISE Code — ${String(school.udise_code).padStart(11, '0')}`}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 14 }}>
                {lang === 'hi' ? (
                  <>
                    {school.school_name} का UDISE कोड <strong>{String(school.udise_code).padStart(11, '0')}</strong> है। UDISE का अर्थ है शिक्षा के लिए एकीकृत जिला सूचना प्रणाली — भारत सरकार के शिक्षा मंत्रालय द्वारा भारत के प्रत्येक स्कूल को आवंटित 11 अंकों का एक विशिष्ट कोड।
                  </>
                ) : (
                  <>
                    The UDISE code of {school.school_name} is <strong>{String(school.udise_code).padStart(11, '0')}</strong>. UDISE stands for Unified District Information System for Education — a unique 11-digit code assigned to every school in India by the Ministry of Education, Government of India.
                  </>
                )}
              </p>
              <h3 style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1E40AF', marginBottom: 10 }}>{lang === 'hi' ? 'इस UDISE कोड को कैसे समझें' : 'How to read this UDISE code'}</h3>
              <div className="udise-breakdown-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 14 }}>
                {udiseBreakdown.map((part, i) => (
                  <div key={i} style={{ background: udiseColors[i], borderRadius: 8, padding: '10px 6px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '1rem', fontWeight: 700, color: udiseTextColors[i] }}>{part.digits}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: 4, lineHeight: 1.3 }}>{part.label}</div>
                  </div>
                ))}
              </div>
              <div className="highlight-box teal">
                {lang === 'hi' ? (
                  <p>छात्रवृत्ति (NSP), कॉलेज प्रवेश और राष्ट्रीय छात्रवृत्ति पोर्टल (Scholarships.gov.in) पर स्कूल की प्रामाणिकता की जांच करने के लिए आपके बच्चे को इस UDISE कोड की आवश्यकता होगी।</p>
                ) : (
                  <p>Your child needs this UDISE code for scholarship applications, college admission forms, and verifying school credentials with government portals like Scholarships.gov.in and NSP.</p>
                )}
              </div>
            </div>

            {/* Facilities */}
            <div id="infrastructure" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 8, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                🔧 {lang === 'hi' ? 'स्कूल की सुविधाएँ' : 'School Facilities'}
              </h2>
              {!(school.has_playground || school.has_internet || school.has_library === 1 || school.has_electricity === 1 || school.has_toilet === 1) && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                  {lang === 'hi' ? (
                    <p style={{ fontSize: '0.8rem', color: '#78350F', margin: 0 }}>
                      <strong>⚠️ डेटा उपलब्ध नहीं है।</strong> वर्तमान डेटासेट में इस स्कूल की सुविधाओं (शौचालय, बिजली, पुस्तकालय आदि) के सटीक रिकॉर्ड उपलब्ध नहीं हैं। सही जानकारी के लिए UDISE+ पोर्टल से UDISE कोड <strong>{String(school.udise_code).padStart(11, '0')}</strong> के माध्यम से स्कूल का निःशुल्क रिपोर्ट कार्ड डाउनलोड करें।
                    </p>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#78350F', margin: 0 }}>
                      <strong>⚠️ Data not available in current dataset.</strong> We don't have facility records (toilets, electricity, library etc.) for this school. For accurate infrastructure details, download the free School Report Card from <strong>udiseplus.gov.in</strong> using UDISE code <strong>{String(school.udise_code).padStart(11, '0')}</strong>.
                    </p>
                  )}
                </div>
              )}
              <div className="facilities-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginBottom: 14 }}>
                {FACILITIES_LOCALIZED.map(f => {
                  const { status, label } = getFacilityStatus(school, f.key, lang);
                  const statusColor = status === 'available' ? '#10B981' : status === 'verify' ? '#94A3B8' : '#EF4444';
                  return (
                    <div key={f.key} style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, background: '#F8FAFC' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize: '0.775rem', color: '#475569', fontWeight: 500 }}>{f.label}</div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: statusColor, marginTop: 1 }}>{label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.775rem', color: '#64748B', lineHeight: 1.6, marginTop: 4 }}>
                {lang === 'hi' ? (
                  'किसी भी स्कूल में जाने से पहले, यह जांच लें कि वहाँ लड़कों और लड़कियों के लिए अलग शौचालय चालू हैं या नहीं, और पेयजल उपलब्ध है या नहीं। आप ब्लॉक शिक्षा अधिकारी (BEO) से भी स्कूल की निरीक्षण रिपोर्ट मांग सकते हैं।'
                ) : (
                  `Before visiting any school, check if separate toilets for boys and girls are working, and whether drinking water is available. You can also ask the Block Education Officer (BEO) in ${school.block} for an inspection report.`
                )}
              </p>
            </div>

            {/* Nearby Schools */}
            {nearby.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                  🏫 {lang === 'hi' ? `${school.village} में आस-पास के स्कूल` : `Nearby Schools in ${school.village}`}
                </h2>
                <div className="nearby-schools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  {nearby.map(nb => (
                    <Link key={nb.udise_code} href={nb.url ? `${pathPrefix}${nb.url}` : '#'} style={{ textDecoration: 'none' }}>
                      <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', background: '#F8FAFC', transition: 'border-color 0.15s' }}>
                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1E293B', marginBottom: 4, lineHeight: 1.3 }}>{nb.school_name}</div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>{t(nb.school_category, lang)}</span>
                          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{nb.village}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '0.7rem', color: '#94A3B8' }}>UDISE: {nb.udise_code}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* RTE Section */}
            <div id="admissions" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                📜 {lang === 'hi' ? 'आरटीई प्रवेश — अपने बच्चे का नामांकन' : 'RTE Admission — Enrolling Your Child'}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 14 }}>
                {lang === 'hi' ? (
                  <>
                    आरटीई अधिनियम (2009) के तहत, 6 से 14 वर्ष की आयु के प्रत्येक बच्चे को मुफ्त शिक्षा का अधिकार है। {rte.isGovt ? 'यह पहले से ही एक सरकारी स्कूल है — यहाँ प्रवेश बिल्कुल मुफ्त है।' : `यह एक निजी स्कूल है। आरटीई के तहत, इसे ${school.village} और आस-पास के क्षेत्रों के गरीब परिवारों के बच्चों को 25% सीटें मुफ्त देनी होंगी।`}
                  </>
                ) : (
                  <>
                    Under the RTE Act (2009), every child aged 6 to 14 has the right to free education. {rte.isGovt ? 'This is already a government school — admission here is free.' : `This is a private school. Under RTE, it must give 25% of Class 1 seats free to children from low-income families in ${school.village} and nearby areas.`}
                  </>
                )}
              </p>

              <div style={{ background: '#EFF6FF', borderLeft: '4px solid #3B82F6', borderRadius: '0 8px 8px 0', padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: '0.825rem', color: '#1E40AF', margin: 0, fontWeight: 700, marginBottom: 4 }}>📅 {lang === 'hi' ? 'प्रवेश समय-सीमा चेतावनी' : 'Admission Timeline Alert'}</p>
                <p style={{ fontSize: '0.825rem', color: '#1E3A8A', margin: 0, lineHeight: 1.6 }}>{rte.schedule}</p>
              </div>

              {rte.stepsGovt.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#1E40AF', color: 'white', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: step.replace(/^([^—]+)/, '<strong>$1</strong>') }} />
                </div>
              ))}
              <div className="highlight-box orange">
                <p><strong>RTE 25% Quota:</strong> {rte.rteQuota}</p>
              </div>
            </div>

            {/* Ad */}
            <AdSlot size="responsive" />

            {/* Reviews Section */}
            <div id="reviews">
              <SchoolReviews udiseCode={school.udise_code} schoolName={school.school_name} />
            </div>

            {/* FAQ */}
            <div id="faqs" style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '20px 18px' }}>
              <h2 style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>{t('FAQs', lang)}</h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {faqs.map(({ q, a }) => (
                  <details key={q} className="faq-item">
                    <summary>
                      <span className="faq-q">
                        <span style={{ color: '#1E40AF', flexShrink: 0 }}>✅</span>
                        {q}
                      </span>
                    </summary>
                    <p className="faq-a" dangerouslySetInnerHTML={{ __html: a.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </details>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#92400E', marginBottom: 6 }}>⚠️ {lang === 'hi' ? 'अस्वीकरण (Disclaimer)' : 'Disclaimer'}</div>
              <p style={{ fontSize: '0.775rem', color: '#78350F', lineHeight: 1.75 }}>
                {lang === 'hi' ? (
                  'इस पृष्ठ की जानकारी शिक्षा मंत्रालय, भारत सरकार द्वारा प्रकाशित UDISE+ और भारत की जनगणना के जनसांख्यिकी डेटा से ली गई है। SchoolsPedia.in एक स्वतंत्र सूचना मंच है और शिक्षा मंत्रालय या किसी राज्य के शिक्षा विभाग से आधिकारिक रूप से संबद्ध नहीं है। सभी डेटा केवल जानकारी के लिए हैं। किसी भी स्कूल में नामांकन का निर्णय लेने से पहले सीधे स्कूल या अपने ब्लॉक शिक्षा अधिकारी (BEO) से जानकारी सत्यापित करें।'
                ) : (
                  'The information on this page is sourced from UDISE+, published by the Ministry of Education, Government of India, and from Census of India demographic data. SchoolsPedia.in is an independent information platform and is not affiliated with, endorsed by, or officially connected to the Ministry of Education or any state education department. All data is for informational purposes only. Always verify with the school directly or your Block Education Officer (BEO) before making enrollment decisions.'
                )}
              </p>
            </div>

            {/* Breadcrumb trail */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>🗺️ {lang === 'hi' ? 'आप यहाँ हैं' : 'You are here'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { label: t('Home', lang), href: '/' },
                  { label: stateName, href: `${pathPrefix}/schools/${stateSlug}` },
                  { label: districtName, href: `${pathPrefix}/schools/${stateSlug}/${districtSlug}` },
                  { label: school.block, href: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
                  { label: school.village, href: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
                  { label: school.school_name, href: null },
                ].map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i > 0 && <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>›</span>}
                    {item.href
                      ? <Link href={item.href} style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 500 }}>{item.label}</Link>
                      : <span style={{ fontSize: '0.8rem', color: '#1E293B', fontWeight: 700 }}>{item.label}</span>
                    }
                  </span>
                ))}
              </div>
            </div>

            {/* Fix 5: More Schools in District — Internal Linking & Topical Cluster */}
            {nearby && nearby.length > 0 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: '14px 18px' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
                  📚 {lang === 'hi' ? `${districtName} जिले में और स्कूल` : `More Schools in ${districtName} District`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {nearby.slice(0, 6).map((s) => (
                    <Link
                      key={s.udise_code}
                      href={`${pathPrefix}${s.url}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 0',
                        borderBottom: '1px solid #F1F5F9',
                        fontSize: '0.8rem',
                        color: '#1E40AF',
                        fontWeight: 500,
                        textDecoration: 'none',
                        gap: 8,
                      }}
                    >
                      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.school_name}
                      </span>
                      <span style={{ flexShrink: 0, fontSize: '0.7rem', color: '#94A3B8', fontStyle: 'italic' }}>
                        {s.village}
                      </span>
                    </Link>
                  ))}
                  <Link
                    href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}`}
                    style={{
                      display: 'block',
                      marginTop: 10,
                      padding: '8px 12px',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: 7,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#1E40AF',
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    {lang === 'hi' ? `→ ${districtName} जिले के सभी स्कूल देखें` : `→ View all schools in ${districtName} District`}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* At a Glance */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                {lang === 'hi' ? 'स्कूल एक नज़र में' : 'School at a glance'}
              </div>
              {[
                [lang === 'hi' ? 'श्रेणी' : 'Category', t(school.school_category, lang), '#1E40AF'],
                [lang === 'hi' ? 'प्रकार' : 'Type', t(school.school_type, lang), '#0D9488'],
                [lang === 'hi' ? 'प्रबंधन' : 'Management', t(school.national_mgmt, lang)?.replace('Department of Education', 'Dept. of Education'), '#1E293B'],
                [lang === 'hi' ? 'क्षेत्र' : 'Location', school.location === 'Rural' ? (lang === 'hi' ? '🌿 ग्रामीण' : 'Rural') : (lang === 'hi' ? '🏙️ शहरी' : 'Urban'), '#16A34A'],
                [lang === 'hi' ? 'स्थिति' : 'Status', t(school.school_status, lang), isOperational ? '#10B981' : '#EF4444'],
                [lang === 'hi' ? 'UDISE कोड' : 'UDISE Code', String(school.udise_code).padStart(11, '0'), '#1E40AF'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem' }}>
                  <span style={{ color: '#64748B', fontSize: '0.775rem' }}>{label}</span>
                  <span style={{ color, fontWeight: 700, fontSize: '0.78rem', textAlign: 'right', maxWidth: 140 }}>{val}</span>
                </div>
              ))}
              <SchoolActions schoolName={school.school_name} lang={lang} />
            </div>

            {/* Location */}
            {districtStats?.dist_avg_lat && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>📍 {lang === 'hi' ? 'स्थान' : 'Location'}</div>
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, height: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: 24 }}>📍</span>
                  <div style={{ fontSize: '0.8rem', color: '#3B82F6', fontWeight: 600 }}>{school.village}, {school.block}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'var(--font-mono), monospace' }}>{Number(districtStats.dist_avg_lat).toFixed(4)}°N, {Number(districtStats.dist_avg_long).toFixed(4)}°E</div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>🔗 {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}</div>
              {[
                [lang === 'hi' ? `${school.village} में स्कूल` : `Schools in ${school.village}`, `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}`],
                [lang === 'hi' ? `${school.block} ब्लॉक में स्कूल` : `${school.block} block schools`, `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}`],
                [lang === 'hi' ? `${districtName} जिले में स्कूल` : `${school.district} district schools`, `${pathPrefix}/schools/${stateSlug}/${districtSlug}`],
                [lang === 'hi' ? `${stateName} में ${t(school.school_category, lang)} स्कूल` : `${school.school_category} schools in ${school.state}`, `/search?state=${stateSlug}&category=${school.school_category}`],
                [lang === 'hi' ? `${stateName} में स्कूल` : `${school.state} schools`, `${pathPrefix}/schools/${stateSlug}`],
              ].map(([label, href]) => (
                <Link key={href} href={href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #F1F5F9', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 500, textDecoration: 'none' }}>
                  {label} <span>→</span>
                </Link>
              ))}
            </div>

            {/* Ad */}
            <AdSlot size="sidebar" />

            {/* District Stats */}
            <DistrictStats stats={districtStats} districtName={districtName} lang={lang} />

            {/* Error Report */}
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400E', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>⚠️ {lang === 'hi' ? 'कोई गलती मिली?' : 'Found an error?'}</div>
              <p style={{ fontSize: '0.775rem', color: '#78350F', lineHeight: 1.6, marginBottom: 10 }}>
                {lang === 'hi' ? (
                  'यदि इस पृष्ठ पर कोई जानकारी गलत है, तो कृपया हमें रिपोर्ट करें। हम 7 कार्य दिवसों के भीतर समीक्षा करके अपडेट करते हैं।'
                ) : (
                  'If any detail on this page is incorrect, please report it. We review and update within 7 working days.'
                )}
              </p>
              <Link href="/contact" style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '9px', borderRadius: 7, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                {lang === 'hi' ? '🚩 गलत जानकारी की रिपोर्ट करें' : '🚩 Report incorrect data'}
              </Link>
            </div>

            {/* Ad */}
            <AdSlot size="sidebar" />

            {/* Search */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>🔍 {lang === 'hi' ? 'स्कूल खोजें' : 'Search schools'}</div>
              <div style={{ display: 'flex', border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden' }}>
                <input type="text" placeholder={lang === 'hi' ? 'स्कूल का नाम, UDISE...' : 'School name, UDISE...'} style={{ flex: 1, border: 'none', outline: 'none', padding: '9px 10px', fontSize: '0.8rem', background: '#F8FAFC' }} />
                <Link href="/search" style={{ background: '#1E40AF', color: 'white', border: 'none', padding: '9px 12px', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>🔍</Link>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 6 }}>
                {lang === 'hi' ? 'भारत के 16.5 लाख+ स्कूलों में से खोजें' : 'Search from 16.5 lakh+ schools across India'}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', borderRadius: 10, padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-heading), sans-serif', fontSize: '0.95rem', fontWeight: 700, color: 'white', marginBottom: 6 }}>
                {lang === 'hi' ? 'अपना स्कूल नहीं मिल रहा?' : "Can't find your school?"}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#BAE6FD', lineHeight: 1.5, marginBottom: 14 }}>
                {lang === 'hi' ? 'सभी 36 राज्यों के 16.5 लाख+ स्कूलों में खोजें' : 'Search from 16.5 lakh+ schools across all 36 states'}
              </div>
              <Link href="/search" style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                🔍 {lang === 'hi' ? 'सभी स्कूल खोजें' : 'Search all schools'}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .jump-link:hover {
          color: #1E40AF !important;
          border-bottom-color: #1E40AF !important;
        }
        .card {
          transition: transform 0.25s ease, box-shadow 0.25s ease !important;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.08), 0 8px 8px -6px rgba(0, 0, 0, 0.08) !important;
        }
        .info-table tr {
          transition: background-color 0.15s ease;
        }
        .info-table tr:hover {
          background-color: #F8FAFC !important;
        }
      `}</style>
    </>
  );
}
