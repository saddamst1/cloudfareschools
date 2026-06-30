import SchoolPage, { getSchoolPageMetadata } from '@/app/schools/[state]/[district]/[block]/[village]/[school]/page';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];



export async function generateMetadata(props) {
  const { state: stateSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    return {};
  }
  return getSchoolPageMetadata({ ...props, lang: 'hi' });
}

export default async function SchoolHiPage(props) {
  const { state: stateSlug, district: districtSlug, block: blockSlug, village: villageSlug, school: schoolSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    redirect(`/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}/${schoolSlug}`);
  }
  return <SchoolPage {...props} lang="hi" />;
}
