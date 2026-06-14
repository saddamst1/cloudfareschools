import Link from 'next/link';

export default function BreadcrumbNav({ items }) {
  // items: [{ label, href }, ...] — last item has no href (current page)
  return (
    <div className="breadcrumb" aria-label="breadcrumb">
      <div className="breadcrumb-inner">
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && <span className="sep" aria-hidden="true">›</span>}
            {item.href
              ? <Link href={item.href}>{item.label}</Link>
              : <span className="current">{item.label}</span>
            }
          </span>
        ))}
      </div>
    </div>
  );
}
