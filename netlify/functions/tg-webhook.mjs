export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Telegram Webhook Relay OK", { status: 200 });
  }

  const reqUrl = new URL(req.url);
  const target = (reqUrl.searchParams.get("target") || "").trim();

  // Безопасность: разрешаем пересылку только на официальный Google Apps Script Web App
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/i.test(target)) {
    return new Response("Bad target", { status: 400 });
  }

  const body = await req.text();

  try {
    const gasRes = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      redirect: "follow",
    });
    await gasRes.text();
  } catch (err) {
    console.error("Relay error:", err);
  }

  return new Response("OK", { status: 200 });
};
