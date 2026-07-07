export interface EmailItem {
  rank: number;
  title: string;
  section: string;
  summaryBullets: string[];
  whyItMatters?: string | null;
  sourceLinks: { title: string; url: string; sourceName: string }[];
}

export function renderBriefingEmail(
  briefingTitle: string,
  items: EmailItem[],
  unsubscribeUrl: string,
  settingsUrl: string,
): { html: string; text: string } {
  const itemHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #999; margin: 0 0 4px;">
          ${item.section} · #${item.rank}
        </p>
        <h3 style="margin: 0 0 8px; font-size: 16px;">${item.title}</h3>
        <ul style="margin: 0 0 8px; padding-left: 16px;">
          ${item.summaryBullets.map((b) => `<li style="font-size: 14px; color: #555; margin-bottom: 4px;">${b}</li>`).join("")}
        </ul>
        ${item.whyItMatters ? `<p style="font-size: 13px; color: #777;"><strong>Why it matters:</strong> ${item.whyItMatters}</p>` : ""}
        <p style="font-size: 12px; color: #999;">
          ${item.sourceLinks.map((l) => `<a href="${l.url}" style="color: #2563eb;">${l.sourceName}</a>`).join(" · ")}
        </p>
      </td>
    </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0; padding: 0; background: #f5f5f5; font-family: -apple-system, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td align="center" style="padding: 24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px;">
<tr><td style="padding: 24px; border-bottom: 2px solid #000;">
<h1 style="margin:0; font-size: 20px;">${briefingTitle}</h1>
</td></tr>
${itemHtml}
<tr><td style="padding: 16px 24px; text-align: center; font-size: 12px; color: #999;">
<a href="${settingsUrl}" style="color: #999;">Settings</a> ·
<a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `${briefingTitle}\n\n${items.map((item) => `#${item.rank} ${item.title}\n${item.summaryBullets.map((b) => `- ${b}`).join("\n")}\n`).join("\n")}\n---\nSettings: ${settingsUrl}\nUnsubscribe: ${unsubscribeUrl}`;

  return { html, text };
}

export async function sendEmail(to: string, subject: string, html: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "skipped" as const };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "no-reply@dawnbrief.app",
      to,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { status: "failed" as const, error: err };
  }

  const data = await res.json();
  return { status: "sent" as const, messageId: data.id };
}
