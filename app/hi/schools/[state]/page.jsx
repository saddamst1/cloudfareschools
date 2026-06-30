import StatePage, { getStatePageMetadata } from '@/app/schools/[state]/page';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const TARGET_STATES = ['uttar-pradesh', 'bihar', 'madhya-pradesh'];



export async function generateMetadata(props) {
  const { state: stateSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    return {};
  }
  return getStatePageMetadata({ ...props, lang: 'hi' });
}

export default async function StateHiPage(props) {
  const { state: stateSlug } = await props.params;
  if (!TARGET_STATES.includes(stateSlug)) {
    redirect(`/schools/${stateSlug}`);
  }
  return <StatePage {...props} lang="hi" />;
}
