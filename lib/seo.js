import { t } from './translate.js';

export function getHomepageMeta() {
  return {
    title: 'SchoolsPedia — India\'s Largest School Directory | 16.5 Lakh+ Schools',
    description: 'Find any school in India by name, UDISE code, village, block or district. 1,653,159 schools from UDISE+ across 36 states. Official government data, free to search.',
    keywords: 'schools in India, UDISE code, school directory India, government schools, private schools, UDISE+',
    openGraph: {
      title: 'SchoolsPedia — Find Any School in India',
      description: 'India\'s most comprehensive school directory. 16.5 Lakh+ schools across 36 states. UDISE codes, demographics, nearby schools — all free.',
      url: 'https://www.schoolspedia.in',
      siteName: 'SchoolsPedia',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: { canonical: 'https://www.schoolspedia.in' },
    robots: { index: true, follow: true },
  };
}

export function getStateMeta(state, lang = 'en') {
  const n = state.total_schools?.toLocaleString('en-IN') || '0';
  const stateName = t(state.state_slug, lang);
  const isTargetState = ['uttar-pradesh', 'bihar', 'madhya-pradesh'].includes(state.state_slug);
  const canonicalUrl = lang === 'hi' 
    ? `https://www.schoolspedia.in/hi/schools/${state.state_slug}` 
    : `https://www.schoolspedia.in/schools/${state.state_slug}`;
  const alternates = {
    canonical: canonicalUrl,
    ...(isTargetState ? {
      languages: {
        'en-IN': `https://www.schoolspedia.in/schools/${state.state_slug}`,
        'hi-IN': `https://www.schoolspedia.in/hi/schools/${state.state_slug}`,
        'x-default': `https://www.schoolspedia.in/schools/${state.state_slug}`
      }
    } : {})
  };

  if (lang === 'hi') {
    return {
      title: `${stateName} में स्कूल — ${n}+ स्कूल, UDISE कोड | SchoolsPedia`,
      description: `${stateName} में ${n}+ स्कूलों की सूची। ${state.district_count} जिलों और ${state.block_count} ब्लॉकों में सरकारी, निजी, केवीएस (KVS) और नवोदय (NVS) स्कूलों की जानकारी UDISE कोड के साथ प्राप्त करें।`,
      alternates,
      openGraph: {
        title: `${stateName} में स्कूल | SchoolsPedia`,
        description: `${stateName} में ${state.district_count} जिलों में ${n}+ स्कूल`,
        url: `https://www.schoolspedia.in/hi/schools/${state.state_slug}`,
        images: [{ url: '/og-schools.png', width: 1200, height: 630, alt: `${stateName} में स्कूल` }],
      },
      twitter: { card: 'summary_large_image', images: ['/og-schools.png'] },
    };
  }

  return {
    title: `Schools in ${state.state_name} — ${n}+ Schools, UDISE Codes | SchoolsPedia`,
    description: `Browse ${n}+ schools in ${state.state_name} across ${state.district_count} districts and ${state.block_count} blocks. Search government, private, KVS, NVS schools by district, block, or village.`,
    alternates,
    openGraph: {
      title: `Schools in ${state.state_name} | SchoolsPedia`,
      description: `${n}+ schools across ${state.district_count} districts in ${state.state_name}`,
      url: `https://www.schoolspedia.in/schools/${state.state_slug}`,
      images: [{ url: '/og-schools.png', width: 1200, height: 630, alt: `Schools in ${state.state_name}` }],
    },
    twitter: { card: 'summary_large_image', images: ['/og-schools.png'] },
  };
}

export function getDistrictMeta(district, lang = 'en') {
  const n = district.total_schools?.toLocaleString('en-IN') || '0';
  const stateName = t(district.state_slug, lang);
  const distName = t(district.district_slug, lang);
  const isTargetState = ['uttar-pradesh', 'bihar', 'madhya-pradesh'].includes(district.state_slug);
  const canonicalUrl = lang === 'hi'
    ? `https://www.schoolspedia.in/hi/schools/${district.state_slug}/${district.district_slug}`
    : `https://www.schoolspedia.in/schools/${district.state_slug}/${district.district_slug}`;
  const alternates = {
    canonical: canonicalUrl,
    ...(isTargetState ? {
      languages: {
        'en-IN': `https://www.schoolspedia.in/schools/${district.state_slug}/${district.district_slug}`,
        'hi-IN': `https://www.schoolspedia.in/hi/schools/${district.state_slug}/${district.district_slug}`,
        'x-default': `https://www.schoolspedia.in/schools/${district.state_slug}/${district.district_slug}`
      }
    } : {})
  };

  if (lang === 'hi') {
    return {
      title: `${distName} जिला, ${stateName} में स्कूल — ${n}+ स्कूल | SchoolsPedia`,
      description: `${stateName} के ${distName} जिले में ${n}+ स्कूल। ${district.block_count} ब्लॉकों में सरकारी और निजी स्कूलों की सूची, UDISE कोड की जानकारी।`,
      alternates,
      openGraph: {
        title: `${distName} जिले में स्कूल | SchoolsPedia`,
        description: `${stateName} के ${distName} जिले में ${n}+ स्कूल`,
        images: [{ url: '/og-schools.png', width: 1200, height: 630, alt: `${distName} में स्कूल` }],
      },
      twitter: { card: 'summary_large_image', images: ['/og-schools.png'] },
    };
  }

  const lit = district.dist_literacy_pct ? ` Literacy rate: ${district.dist_literacy_pct}%.` : '';
  return {
    title: `Schools in ${district.district_name}, ${district.state_name} — ${n}+ Schools | SchoolsPedia`,
    description: `Find ${n}+ schools in ${district.district_name} district, ${district.state_name}. Browse ${district.block_count} blocks, government and private schools, UDISE codes.${lit}`,
    alternates,
    openGraph: {
      title: `Schools in ${district.district_name} District | SchoolsPedia`,
      description: `${n}+ schools in ${district.district_name}, ${district.state_name}`,
      images: [{ url: '/og-schools.png', width: 1200, height: 630, alt: `Schools in ${district.district_name}` }],
    },
    twitter: { card: 'summary_large_image', images: ['/og-schools.png'] },
  };
}

export function getBlockMeta(block, lang = 'en') {
  const n = block.total_schools?.toLocaleString('en-IN') || '0';
  const stateName = t(block.state_slug, lang);
  const distName = t(block.district_slug, lang);
  const blockName = block.block_name;
  const isTargetState = ['uttar-pradesh', 'bihar', 'madhya-pradesh'].includes(block.state_slug);
  const canonicalUrl = lang === 'hi'
    ? `https://www.schoolspedia.in/hi/schools/${block.state_slug}/${block.district_slug}/${block.block_slug}`
    : `https://www.schoolspedia.in/schools/${block.state_slug}/${block.district_slug}/${block.block_slug}`;
  const alternates = {
    canonical: canonicalUrl,
    ...(isTargetState ? {
      languages: {
        'en-IN': `https://www.schoolspedia.in/schools/${block.state_slug}/${block.district_slug}/${block.block_slug}`,
        'hi-IN': `https://www.schoolspedia.in/hi/schools/${block.state_slug}/${block.district_slug}/${block.block_slug}`,
        'x-default': `https://www.schoolspedia.in/schools/${block.state_slug}/${block.district_slug}/${block.block_slug}`
      }
    } : {})
  };

  if (lang === 'hi') {
    return {
      title: `${blockName} ब्लॉक, ${distName} में स्कूल — ${n}+ स्कूल | SchoolsPedia`,
      description: `${stateName} के ${distName} जिले के ${blockName} ब्लॉक में ${n}+ स्कूल। ${block.village_count} गाँवों में UDISE कोड और विस्तृत जानकारी के साथ स्कूलों की सूची।`,
      alternates,
    };
  }

  return {
    title: `Schools in ${block.block_name} Block, ${block.district_name} — ${n}+ Schools | SchoolsPedia`,
    description: `Browse ${n}+ schools in ${block.block_name} block, ${block.district_name}, ${block.state_name}. ${block.village_count} villages covered with UDISE codes and full school details.`,
    alternates,
  };
}

export function getVillageMeta(village, stateSlug, districtSlug, blockSlug, schoolCount, lang = 'en') {
  const stateName = t(stateSlug, lang);
  const distName = t(districtSlug, lang);
  const villageName = village.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
  const isTargetState = ['uttar-pradesh', 'bihar', 'madhya-pradesh'].includes(stateSlug);
  const canonicalUrl = lang === 'hi'
    ? `https://www.schoolspedia.in/hi/schools/${stateSlug}/${districtSlug}/${blockSlug}/${village}`
    : `https://www.schoolspedia.in/schools/${stateSlug}/${districtSlug}/${blockSlug}/${village}`;
  const alternates = {
    canonical: canonicalUrl,
    ...(isTargetState ? {
      languages: {
        'en-IN': `https://www.schoolspedia.in/schools/${stateSlug}/${districtSlug}/${blockSlug}/${village}`,
        'hi-IN': `https://www.schoolspedia.in/hi/schools/${stateSlug}/${districtSlug}/${blockSlug}/${village}`,
        'x-default': `https://www.schoolspedia.in/schools/${stateSlug}/${districtSlug}/${blockSlug}/${village}`
      }
    } : {})
  };

  if (lang === 'hi') {
    return {
      title: `${villageName} गाँव में स्कूल — ${schoolCount} स्कूल | SchoolsPedia`,
      description: `${stateName} के ${distName} जिले में ${villageName} गाँव के स्कूलों की सूची। UDISE कोड, स्कूल श्रेणी और प्रबंधन के प्रकार की पूरी जानकारी प्राप्त करें।`,
      alternates,
    };
  }

  return {
    title: `Schools in ${villageName} Village — ${schoolCount} Schools | SchoolsPedia`,
    description: `${schoolCount} school${schoolCount !== 1 ? 's' : ''} in ${villageName} village. Get UDISE codes, school categories, management types, and enrollment details for every school.`,
    alternates,
  };
}

export function getSchoolMeta(school, lang = 'en') {
  const udise = String(school.udise_code).padStart(11, '0');
  const name  = school.school_name;
  const village = school.village;
  const dist  = t(school.district_slug, lang) || school.district;
  const state = t(school.state_slug, lang) || school.state;
  const cat   = t(school.school_category, lang);
  const mgmt  = t(school.national_mgmt, lang);
  const isClosed = school.school_status === 'Permanently Closed';

  const isTargetState = ['uttar-pradesh', 'bihar', 'madhya-pradesh'].includes(school.state_slug);
  const canonicalUrl = lang === 'hi'
    ? `https://www.schoolspedia.in/hi${school.url}`
    : `https://www.schoolspedia.in${school.url}`;
  const alternates = {
    canonical: canonicalUrl,
    ...(isTargetState ? {
      languages: {
        'en-IN': `https://www.schoolspedia.in${school.url}`,
        'hi-IN': `https://www.schoolspedia.in/hi${school.url}`,
        'x-default': `https://www.schoolspedia.in${school.url}`
      }
    } : {})
  };

  const robots = isClosed ? { index: false, follow: true } : { index: true, follow: true };

  if (lang === 'hi') {
    return {
      title: `${name}, ${village}, ${dist} — UDISE ${udise} | SchoolsPedia`,
      description: isClosed
        ? `${name} स्कूल स्थायी रूप से बंद (Permanently Closed) हो चुका है। यह ${village} गाँव, ${dist} जिला, ${state} में स्थित था।`
        : `${name} ${cat} स्कूल है, जो ${village} गाँव, ${dist} जिला, ${state} में स्थित है। UDISE कोड: ${udise} है। प्रबंधन: ${mgmt}। RTE प्रवेश और स्कूल की अन्य जानकारी प्राप्त करें।`,
      keywords: `${name}, UDISE ${udise}, ${village} school, ${dist} school, ${cat} school ${state}`,
      alternates,
      openGraph: {
        title: `${name} — UDISE ${udise}${isClosed ? ' (बंद)' : ''}`,
        description: isClosed
          ? `यह स्कूल स्थायी रूप से बंद (Permanently Closed) हो चुका है।`
          : `${cat} स्कूल, ${village}, ${dist}, ${state}`,
        url: `https://www.schoolspedia.in/hi${school.url}`,
      },
      robots,
    };
  }

  return {
    title: `${name}, ${village}, ${dist} — UDISE ${udise} | SchoolsPedia`,
    description: isClosed
      ? `${name} is permanently closed. It was located in ${village} village, ${dist} district, ${state}.`
      : `${name} is a ${cat} school in ${village} village, ${dist} district, ${state}. UDISE code: ${udise}. Management: ${mgmt}. Type: ${school.school_type}. Status: ${school.school_status}. Find UDISE details, nearby schools, and RTE admission info.`,
    keywords: `${name}, UDISE ${udise}, ${village} school, ${dist} school, ${cat} school ${state}`,
    alternates,
    openGraph: {
      title: `${name} — UDISE ${udise}${isClosed ? ' (Closed)' : ''}`,
      description: isClosed
        ? `This school is permanently closed.`
        : `${cat} school in ${village}, ${dist}, ${state}`,
      url: `https://www.schoolspedia.in${school.url}`,
    },
    robots,
  };
}

// ─── JSON-LD Schema.org ───────────────────────────────────────────────────────

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

export function schoolSchema(school, districtStats, reviewStats = null) {
  const udise = String(school.udise_code).padStart(11, '0');
  const isGovt = school.national_mgmt?.includes('Department') || school.national_mgmt?.includes('Local Body');

  // Map UDISE category to Schema educationalLevel
  const levelMap = {
    'Primary': 'Primary Education',
    'Upper Primary': 'Middle School Education',
    'Secondary': 'Secondary Education',
    'Higher Secondary': 'Higher Secondary Education',
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'School',
    name: school.school_name,
    identifier: {
      '@type': 'PropertyValue',
      name: 'UDISE Code',
      value: udise,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: school.address || school.village,
      addressLocality: school.block || school.district,
      addressRegion: school.state,
      postalCode: school.pincode ? String(school.pincode) : (districtStats?.dist_sample_pin ? String(districtStats.dist_sample_pin) : undefined),
      addressCountry: 'IN',
    },
    educationalLevel: levelMap[school.school_category] || school.school_category,
    url: `https://www.schoolspedia.in${school.url}`,
    areaServed: `${school.village}, ${school.district}, ${school.state}`,
  };

  if (school.email) {
    schema.email = cleanEmail(school.email);
  }

  if (school.phone) {
    schema.telephone = school.phone;
  }

  if (districtStats?.dist_avg_lat) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: districtStats.dist_avg_lat,
      longitude: districtStats.dist_avg_long,
    };
  }

  if (school.establishment_year && Number(school.establishment_year) > 1800) {
    schema.foundingDate = String(school.establishment_year);
  } else if (school.year_established && Number(school.year_established) > 1800) {
    schema.foundingDate = String(school.year_established);
  }

  // Only add parentOrganization for government schools
  if (isGovt && school.national_mgmt) {
    schema.parentOrganization = {
      '@type': 'GovernmentOrganization',
      name: school.national_mgmt,
    };
  }

  // Add AggregateRating if reviews exist
  if (reviewStats && Number(reviewStats.count) > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': String(reviewStats.avgRating),
      'reviewCount': String(reviewStats.count),
      'bestRating': '5',
      'worstRating': '1'
    };
  }

  return schema;
}


export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://www.schoolspedia.in${item.url}`,
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SchoolsPedia',
    url: 'https://www.schoolspedia.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.schoolspedia.in/logo.png',
      width: 512,
      height: 512,
    },
    description: 'Free school directory for India. 1.65 lakh+ schools indexed from UDISE+ data by the Ministry of Education.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: 'https://www.schoolspedia.in/contact',
    },
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SchoolsPedia',
    url: 'https://www.schoolspedia.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.schoolspedia.in/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
