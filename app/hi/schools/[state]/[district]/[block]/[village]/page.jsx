import VillagePage, { getVillagePageMetadata } from '@/app/schools/[state]/[district]/[block]/[village]/page';
import { redirect } from 'next/navigation';

export const revalidate = 2592000; // 30 days cache

const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];

export async function generateMetadata(props) {
  const { state: stateSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    return {};
  }
  return getVillagePageMetadata({ ...props, lang: 'hi' });
}

export default async function VillageHiPage(props) {
  const { state: stateSlug, district: districtSlug, block: blockSlug, village: villageSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    redirect(`/schools/${stateSlug}/${districtSlug}/${blockSlug}/${villageSlug}`);
  }
  return <VillagePage {...props} lang="hi" />;
}
