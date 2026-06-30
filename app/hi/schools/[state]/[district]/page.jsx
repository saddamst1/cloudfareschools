import DistrictPage, { getDistrictPageMetadata } from '@/app/schools/[state]/[district]/page';
import { redirect } from 'next/navigation';
import { getAllDistrictSlugs } from '@/lib/queries';

export const dynamic = 'force-dynamic';

const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];



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
