'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong | SchoolsPedia</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 24px; text-align: center; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 40px; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          h1 { font-size: 24px; margin-bottom: 12px; color: #38bdf8; }
          p { color: #94a3b8; font-size: 15px; margin-bottom: 24px; line-height: 1.5; }
          button { background: #2563eb; color: #fff; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 15px; transition: all 0.2s; }
          button:hover { background: #1d4ed8; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <h1>SchoolsPedia</h1>
          <p>We encountered a temporary server error. Please click below to reload the page.</p>
          <button onClick={() => reset ? reset() : window.location.reload()}>Try Again</button>
        </div>
      </body>
    </html>
  );
}
