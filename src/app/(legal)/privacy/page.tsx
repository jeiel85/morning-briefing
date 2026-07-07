export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      <div className="space-y-4 text-sm text-neutral-700">
        <p>DawnBrief collects and stores only the data necessary to deliver your morning briefing:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account data</strong> — email address for login and delivery.</li>
          <li><strong>Preferences</strong> — timezone, schedule, topics, and keyword filters you explicitly set.</li>
          <li><strong>Briefing data</strong> — generated summaries are stored temporarily and linked to your account.</li>
          <li><strong>Feedback</strong> — your ratings help improve future briefings.</li>
        </ul>
        <p>We do not sell your data. We do not serve ads. Source content is fetched from public RSS/API feeds and summarized; full article text is not stored.</p>
        <p>You can delete your account at any time, which removes all stored data.</p>
      </div>
    </main>
  );
}
