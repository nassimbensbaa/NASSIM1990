export default async function handler(req, res) {
  // السماح بـ CORS للاختبار المحلي
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "POST only" });
  }

  try {
    const URL = process.env.SCRIT;

    if (!URL || URL.length < 20 || !URL.includes("script.google.com")) {
      console.error("❌ SCRIT is invalid:", URL);
      return res.status(500).json({
        ok: false,
        error: "SCRIT is missing or invalid"
      });
    }

    const body = req.body || {};

    const payload = {
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      phone: body.phone || "",
      state: body.state || "",
      deliveryType: body.deliveryType || body.delivery || "",
      shipping: Number(body.shipping) || 0,
      total: Number(body.total) || 0,
      productName: body.productName || body.product || ""
    };

    console.log("📤 Sending to Google Sheets:", payload);

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log("📥 Google response:", responseText);

    let googleResult;
    try {
      googleResult = JSON.parse(responseText);
    } catch (e) {
      googleResult = { ok: false, error: "Invalid JSON response", raw: responseText };
    }

    if (googleResult.ok === true) {
      return res.status(200).json({
        ok: true,
        message: "تم إرسال الطلب بنجاح",
        google_response: googleResult
      });
    } else {
      return res.status(500).json({
        ok: false,
        error: googleResult.error || "Google Script returned error",
        google_response: googleResult
      });
    }
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({
      ok: false,
      error: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
  }
}
