import { NextResponse } from 'next/server';
import { getDownloadSchools } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const district = searchParams.get('district');
  const block = searchParams.get('block');

  if (!state || !district) {
    return new NextResponse('Missing state or district parameter', { status: 400 });
  }

  try {
    const schools = await getDownloadSchools(state, district, block);

    // Construct CSV
    const headers = ['UDISE Code', 'School Name', 'Village', 'Block', 'District', 'State', 'Category', 'Management', 'Status'];
    const csvRows = [headers.join(',')];

    for (const school of schools) {
      const esc = (v) => `"${(v || '').replace(/"/g, '""')}"`;
      const row = [
        school.udise_code || '',
        esc(school.school_name),
        esc(school.village),
        esc(school.block),
        esc(school.district),
        esc(school.state),
        esc(school.school_category),
        esc(school.national_mgmt),
        school.school_status || ''
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = '\uFEFF' + csvRows.join('\r\n'); // BOM for proper Excel encoding
    const filename = block
      ? `${block}-schools-list.csv`
      : `${district}-schools-list.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating school list download:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
