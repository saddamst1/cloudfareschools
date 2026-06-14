import DistrictPage, { getDistrictPageMetadata } from '@/app/schools/[state]/[district]/page';
import { redirect } from 'next/navigation';
import { getAllDistrictSlugs } from '@/lib/queries';

export const revalidate = 86400;

const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];

export async function generateStaticParams() {
  const all = await getAllDistrictSlugs();
  return all
    .filter(d => TARGET_STATES.includes(d.state_slug))
    .map(d => ({ state: d.state_slug, district: d.district_slug }));
}

export async function generateMetadata(props) {
  const { state: stateSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    return {};
  }
  return getDistrictPageMetadata({ ...props, lang: 'hi' });
}

export default async function DistrictHiPage(props) {
  const { state: stateSlug, district: districtSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    redirect(`/schools/${stateSlug}/${districtSlug}`);
  }
  return <DistrictPage {...props} lang="hi" />;
}
