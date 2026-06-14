import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getVillageSchools, getDistrictStatsForSchool, getBlockVillages } from '@/lib/queries';
import { breadcrumbSchema } from '@/lib/seo';
import AdSlot from '@/components/AdSlot';
import DistrictStats from '@/components/DistrictStats';
import SchoolCard from '@/components/SchoolCard';

export const revalidate = 86400;
export const dynamicParams = true;

import { t } from '@/lib/translate';
import { getVillageMeta } from '@/lib/seo';

export async function getVillagePageMetadata({ params, lang = 'en' }) {
  const { village: villageSlug, district: districtSlug, state: stateSlug, block: blockSlug } = await params;
  const schools = await getVillageSchools(stateSlug, districtSlug, blockSlug, villageSlug);
  return getVillageMeta(villageSlug, stateSlug, districtSlug, blockSlug, schools.length, lang);
}

export async function generateMetadata(props) {
  return getVillagePageMetadata({ ...props, lang: 'en' });
}

export default async function VillagePage({ params, lang = 'en' }) {
  const { state: stateSlug, district: districtSlug, block: blockSlug, village: villageSlug } = await params;

  const [schools, districtStats, allVillages] = await Promise.all([
    getVillageSchools(stateSlug, districtSlug, blockSlug, villageSlug),
    getDistrictStatsForSchool(stateSlug, districtSlug),
    getBlockVillages(stateSlug, districtSlug, blockSlug),
  ]);

  const villageName = schools.length > 0
    ? schools[0].village
    : villageSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const blockName = blockSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateName = t(stateSlug, lang);
  const districtName = t(districtSlug, lang);

  const pathPrefix = lang === 'hi' ? '/hi' : '';

  const crumbSchema = breadcrumbSchema([
    { name: t('Home', lang), url: '/' },
    { name: stateName, url: `${pathPrefix}/schools/${stateSlug}` },
    { name: districtName, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}` },
    { name: blockName, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}` },
    { name: villageName, url: `${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}` },
  ]);

  const fmt = (n) => n ? Number(n).toLocaleString('en-IN') : '—';

  const faqs = lang === 'hi' ? [
    {
      q: `${villageName} गाँव में कुल कितने स्कूल हैं?`,
      a: `${villageName} गाँव में UDISE+ डेटाबेस में **${schools.length} स्कूल** पंजीकृत हैं।`
    },
    {
      q: `क्या ${villageName} में मुफ्त सरकारी स्कूल हैं?`,
      a: schools.some(s => s.national_mgmt?.includes('Department') || s.national_mgmt?.includes('Local Body'))
        ? `हाँ। ऊपर दिए गए स्कूल कार्ड देखें — जिन स्कूलों पर 'सरकारी' (Government) लिखा है, वे निःशुल्क हैं। वहाँ कोई ट्यूशन फीस नहीं ली जाती, पाठ्यपुस्तकें प्रदान की जाती हैं, और हर स्कूल दिन मध्याह्न भोजन मिलता है।`
        : `इस गाँव के पंजीकृत स्कूलों में शायद कोई सरकारी स्कूल नहीं है — कार्डों पर प्रबंधन का प्रकार जांचें। यदि आपको निःशुल्क सरकारी स्कूल की आवश्यकता है, तो आस-पास के गाँवों या **${blockName} ब्लॉक** में देखें।`
    },
    {
      q: `कक्षा 9-12 के छात्र कहाँ पढ़ते हैं?`,
      a: schools.some(s => s.school_category === 'Secondary' || s.school_category === 'Higher Secondary')
        ? `इस गाँव में ही माध्यमिक/उच्चतर माध्यमिक स्कूल उपलब्ध है। ऊपर दिए गए कार्डों में इसकी जानकारी देख सकते हैं।`
        : `इस गाँव में कोई माध्यमिक स्कूल उपलब्ध नहीं है। यहाँ के छात्र आमतौर पर **${blockName} ब्लॉक** या जिला मुख्यालय के नजदीकी माध्यमिक स्कूलों में जाते हैं।`
    }
  ] : [
    {
      q: `How many schools are in ${villageName}?`,
      a: `${schools.length} school${schools.length !== 1 ? 's are' : ' is'} registered in ${villageName} in the UDISE+ database.`
    },
    {
      q: `Are there free government schools in ${villageName}?`,
      a: schools.some(s => s.national_mgmt?.includes('Department') || s.national_mgmt?.includes('Local Body'))
        ? `Yes. Check the school cards above — schools listed as Government are free. No tuition fee, textbooks provided, and a cooked mid-day meal every school day.`
        : `The schools listed here may not include a government school — check the management type on each card. If you need a free government school, look in nearby villages in **${blockName} block**.`
    },
    {
      q: `Where do Class 9-12 students from ${villageName} study?`,
      a: schools.some(s => s.school_category === 'Secondary' || s.school_category === 'Higher Secondary')
        ? `There is a secondary school in ${villageName} itself. Check the school cards above for secondary options.`
        : `${villageName} doesn't appear to have a secondary school. Students usually go to the nearest secondary school in **${blockName} block** or the district headquarters.`
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbSchema) }} />

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <Link href="/">{t('Home', lang)}</Link><span className="sep">›</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}`}>{stateName}</Link><span className="sep">›</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}`}>{districtName}</Link><span className="sep">›</span>
          <Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}`}>{blockName}</Link><span className="sep">›</span>
          <span className="current">{villageName}</span>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', padding: '28px 24px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Sora, sans-serif', fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700, color: 'white', marginBottom: 8 }}>
            {lang === 'hi' ? `${villageName} गाँव में स्कूल` : `Schools in ${villageName} Village`}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#93C5FD' }}>
            {lang === 'hi' ? (
              `${schools.length} स्कूल मिले · ${districtName} जिला · ${stateName}`
            ) : (
              `${schools.length} school${schools.length !== 1 ? 's' : ''} found · ${districtName} District · ${stateName}`
            )}
            {districtStats?.dist_literacy_pct ? ` · ${lang === 'hi' ? 'जिला साक्षरता' : 'District literacy'}: ${districtStats.dist_literacy_pct.toFixed(1)}%` : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <div className="school-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div>
            <AdSlot size="leaderboard" />

            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontFamily: 'Sora, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 14 }}>
                {lang === 'hi' ? `${villageName} में सभी ${schools.length} स्कूल` : `All ${schools.length} Schools in ${villageName}`}
              </h2>

              {schools.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                  <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    {lang === 'hi' ? (
                      'हमारे डेटाबेस में इस गाँव के लिए कोई स्कूल नहीं मिला। यह एक बहुत छोटी बस्ती हो सकती है या स्कूल किसी नजदीकी गाँव के तहत सूचीबद्ध हो सकते हैं।'
                    ) : (
                      'No schools found for this village in our database. This may be a very small settlement or the schools may be listed under an adjacent village.'
                    )}
                  </p>
                  <Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}`} style={{ display: 'inline-block', marginTop: 16, background: '#1E40AF', color: 'white', padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                    {lang === 'hi' ? 'ब्लॉक के सभी स्कूल देखें →' : 'View all schools in this block →'}
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {schools.map(school => <SchoolCard key={school.udise_code} school={school} lang={lang} />)}
                </div>
              )}
            </div>

            {/* Content Section */}
            {schools.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
                
                {/* About Village Schools */}
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 22 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                    {lang === 'hi' ? `${villageName} गाँव में स्कूल` : `Schools in ${villageName} Village`}
                  </h2>
                  {lang === 'hi' ? (
                    <>
                      {schools.length === 1 ? (
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                          UDISE+ के अंतर्गत {villageName} गाँव में <strong>1 स्कूल</strong> पंजीकृत है। स्कूल का UDISE कोड, श्रेणी, प्रबंधन का प्रकार और अन्य विवरण देखने के लिए ऊपर दिए गए स्कूल कार्ड पर क्लिक करें।
                        </p>
                      ) : schools.length <= 5 ? (
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
                          {villageName} गाँव में UDISE+ के अंतर्गत <strong>{schools.length} स्कूल</strong> पंजीकृत हैं। ऊपर दिए गए कार्ड प्रत्येक स्कूल का नाम, श्रेणी (प्राथमिक / उच्च प्राथमिक / माध्यमिक) और प्रबंधन का प्रकार (सरकारी या निजी) दर्शाते हैं।
                        </p>
                      ) : (
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
                          {villageName} गाँव में UDISE+ के अंतर्गत कुल <strong>{schools.length} स्कूल</strong> पंजीकृत हैं। ऊपर दिए गए कार्डों में प्रत्येक स्कूल का नाम, श्रेणी और प्रबंधन का प्रकार दिखाया गया है। पूरा विवरण और UDISE कोड देखने के लिए किसी भी कार्ड पर क्लिक करें।
                        </p>
                      )}
                      <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                        {schools.some(s => s.national_mgmt?.includes('Department') || s.national_mgmt?.includes('Local Body'))
                          ? `यहाँ कम से कम एक स्कूल सरकारी है। सरकारी स्कूल निःशुल्क हैं — कोई ट्यूशन फीस नहीं ली जाती, निःशुल्क पाठ्यपुस्तकें मिलती हैं, और PM POSHAN के तहत गर्म पका हुआ भोजन मिलता है।`
                          : `प्रत्येक स्कूल कार्ड पर प्रबंधन का प्रकार जांचें। निजी गैर-सहायता प्राप्त स्कूल फीस लेते हैं। आरटीई के तहत, वे पड़ोस के गरीब परिवारों को 25% सीटें मुफ्त देने के लिए बाध्य हैं।`
                        }
                      </p>
                    </>
                  ) : (
                    <>
                      {schools.length === 1 ? (
                        <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                          There is <strong>1 school</strong> registered in {villageName} under UDISE+. Click on the school card above to see its UDISE code, category, management type, and other details.
                        </p>
                      ) : schools.length <= 5 ? (
                        <>
                          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
                            {villageName} has <strong>{schools.length} schools</strong> registered in UDISE+. The cards above show each school's name, category (Primary / Upper Primary / Secondary), and management type (Government or Private).
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                            {schools.some(s => s.national_mgmt?.includes('Department') || s.national_mgmt?.includes('Local Body'))
                              ? `At least one school here is government-run. Government schools are free — no tuition fee, textbooks provided, and a cooked meal every school day under PM POSHAN.`
                              : `Check the management type on each school card. Private unaided schools charge fees. Under RTE, they must give 25% of Class 1 seats free to low-income families.`
                            }
                          </p>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginBottom: 10 }}>
                            {villageName} has <strong>{schools.length} schools</strong> registered in UDISE+. The school cards above show name, category, and management type. Click any card to see the UDISE code and full details.
                          </p>
                          <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75 }}>
                            For secondary school (Class 9 onwards), check whether a Secondary or Higher Secondary school is listed. If not, students from {villageName} typically travel to the nearest town or block headquarters.
                          </p>
                        </>
                      )}
                    </>
                  )}
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.75, marginTop: 10 }}>
                    {lang === 'hi' ? (
                      'किसी भी स्कूल में जाने से पहले, यह जांच लें कि वहाँ लड़कों और लड़कियों के लिए कार्यात्मक शौचालय और सुरक्षित पेयजल की सुविधा है या नहीं। स्कूल के पृष्ठ पर दिखाए गए UDISE कोड का उपयोग करके udiseplus.gov.in से स्कूल का निःशुल्क रिपोर्ट कार्ड डाउनलोड करें।'
                    ) : (
                      "Before visiting any school, check if it has working toilets for boys and girls and safe drinking water. Download the school's free Report Card from <strong>udiseplus.gov.in</strong> using the UDISE code shown on the school's page."
                    )}
                  </p>
                </div>

                {/* Village FAQs */}
                <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: 22 }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #EFF6FF' }}>
                    {t('FAQs', lang)}
                  </h2>
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

              </div>
            )}

            <AdSlot size="responsive" style={{ marginTop: 20 }} />
          </div>

          <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Other Villages Widget */}
            {allVillages && allVillages.length > 1 && (
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
                  🏘️ {lang === 'hi' ? `${blockName} में अन्य गाँव` : `Other Villages in ${blockName}`}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                  {allVillages
                    .filter(v => v.village_slug !== villageSlug)
                    .slice(0, 10)
                    .map(v => (
                      <Link key={v.village_slug} href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}/${v.village_slug}`}
                        style={{ fontSize: '0.825rem', color: '#1E40AF', textDecoration: 'none', fontWeight: 500 }}
                        className="village-cross-link"
                      >
                        {v.village_name} <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 400 }}>({v.school_count})</span>
                      </Link>
                    ))
                  }
                </div>
              </div>
            )}

            <DistrictStats stats={districtStats} districtName={districtName} lang={lang} />
            <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)', borderRadius: 10, padding: 16, color: 'white' }}>
              <div style={{ fontFamily: 'Sora, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: 8 }}>
                {lang === 'hi' ? 'और स्कूल खोजें' : 'Search more schools'}
              </div>
              <Link href={`${pathPrefix}/schools/${stateSlug}/${districtSlug}/${blockSlug}`} style={{ display: 'block', background: '#F97316', color: 'white', textAlign: 'center', padding: '10px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                {lang === 'hi' ? 'ब्लॉक के सभी स्कूल देखें →' : 'View all block schools →'}
              </Link>
            </div>
            <AdSlot size="sidebar" />
          </div>
        </div>
      </div>

      <style>{`
        .village-cross-link:hover {
          text-decoration: underline !important;
        }
      `}</style>
    </>
  );
}
