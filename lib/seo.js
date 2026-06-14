/**
 * SchoolsPedia — SEO Metadata & Schema.org Generators
 */

// ─── Title & Meta ─────────────────────────────────────────────────────────────

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

export function getStateMeta(state) {
  const n = state.total_schools?.toLocaleString('en-IN') || '0';
  return {
    title: `Schools in ${state.state_name} — ${n}+ Schools, UDISE Codes | SchoolsPedia`,
    description: `Browse ${n}+ schools in ${state.state_name} across ${state.district_count} districts and ${state.block_count} blocks. Search government, private, KVS, NVS schools by district, block, or village.`,
    alternates: { canonical: `https://www.schoolspedia.in/schools/${state.state_slug}` },
    openGraph: {
      title: `Schools in ${state.state_name} | SchoolsPedia`,
      description: `${n}+ schools across ${state.district_count} districts in ${state.state_name}`,
      url: `https://www.schoolspedia.in/schools/${state.state_slug}`,
    },
  };
}

export function getDistrictMeta(district) {
  const n = district.total_schools?.toLocaleString('en-IN') || '0';
  const lit = district.dist_literacy_pct ? ` Literacy rate: ${district.dist_literacy_pct}%.` : '';
  return {
    title: `Schools in ${district.district_name}, ${district.state_name} — ${n}+ Schools | SchoolsPedia`,
    description: `Find ${n}+ schools in ${district.district_name} district, ${district.state_name}. Browse ${district.block_count} blocks, government and private schools, UDISE codes.${lit}`,
    alternates: { canonical: `https://www.schoolspedia.in/schools/${district.state_slug}/${district.district_slug}` },
  };
}

export function getBlockMeta(block) {
  const n = block.total_schools?.toLocaleString('en-IN') || '0';
  return {
    title: `Schools in ${block.block_name} Block, ${block.district_name} — ${n}+ Schools | SchoolsPedia`,
    description: `Browse ${n}+ schools in ${block.block_name} block, ${block.district_name}, ${block.state_name}. ${block.village_count} villages covered with UDISE codes and full school details.`,
    alternates: { canonical: `https://www.schoolspedia.in/schools/${block.state_slug}/${block.district_slug}/${block.block_slug}` },
  };
}

export function getVillageMeta(village, stateSlug, districtSlug, blockSlug, schoolCount) {
  const villageName = village.split('-').map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `Schools in ${villageName} Village — ${schoolCount} Schools | SchoolsPedia`,
    description: `${schoolCount} school${schoolCount !== 1 ? 's' : ''} in ${villageName} village. Get UDISE codes, school categories, management types, and enrollment details for every school.`,
    alternates: { canonical: `https://www.schoolspedia.in/schools/${stateSlug}/${districtSlug}/${blockSlug}/${village}` },
  };
}

export function getSchoolMeta(school) {
  const udise = String(school.udise_code).padStart(11, '0');
  const name  = school.school_name;
  const village = school.village;
  const dist  = school.district;
  const state = school.state;
  const cat   = school.school_category;
  const mgmt  = school.national_mgmt;

  return {
    title: `${name}, ${village}, ${dist} — UDISE ${udise} | SchoolsPedia`,
    description: `${name} is a ${cat} school in ${village} village, ${dist} district, ${state}. UDISE code: ${udise}. Management: ${mgmt}. Type: ${school.school_type}. Status: ${school.school_status}. Find UDISE details, nearby schools, and RTE admission info.`,
    keywords: `${name}, UDISE ${udise}, ${village} school, ${dist} school, ${cat} school ${state}`,
    alternates: { canonical: `https://www.schoolspedia.in${school.url}` },
    openGraph: {
      title: `${name} — UDISE ${udise}`,
      description: `${cat} school in ${village}, ${dist}, ${state}`,
      url: `https://www.schoolspedia.in${school.url}`,
    },
  };
}

// ─── JSON-LD Schema.org ───────────────────────────────────────────────────────

export function schoolSchema(school, districtStats) {
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
      streetAddress: school.village,
      addressLocality: school.block || school.district,
      addressRegion: school.state,
      postalCode: districtStats?.dist_sample_pin ? String(districtStats.dist_sample_pin) : undefined,
      addressCountry: 'IN',
    },
    educationalLevel: levelMap[school.school_category] || school.school_category,
    url: `https://www.schoolspedia.in${school.url}`,
    areaServed: `${school.village}, ${school.district}, ${school.state}`,
  };

  if (districtStats?.dist_avg_lat) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: districtStats.dist_avg_lat,
      longitude: districtStats.dist_avg_long,
    };
  }

  if (school.year_established && Number(school.year_established) > 1800) {
    schema.foundingDate = String(school.year_established);
  }

  // Only add parentOrganization for government schools
  if (isGovt && school.national_mgmt) {
    schema.parentOrganization = {
      '@type': 'GovernmentOrganization',
      name: school.national_mgmt,
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
    logo: 'https://www.schoolspedia.in/logo.png',
    description: 'India\'s largest school directory with 1.65 million schools from UDISE+ data.',
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
