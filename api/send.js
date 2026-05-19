export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "POST only" });
  }

  try {

    // حماية من env فارغ
    const URL = process.env.GOOGLE_SCRIPT_URL;

    if (!URL || URL.length < 10) {
      return res.status(500).json({
        ok: false,
        error: "GOOGLE_SCRIPT_URL is missing or invalid"
      });
    }

    const body = req.body || {};

    const payload = {
      name: `${body.firstName || ""} ${body.lastName || ""}`.trim(),
      phone: body.phone || "",
      state: body.state || "",
      delivery: body.deliveryType || "",
      shipping: body.shipping || 0,
      total: body.total || 0,
      product: body.productName || ""
    };

    // حماية fetch
    let responseText = "";

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      responseText = await response.text();

    } catch (fetchError) {
      return res.status(500).json({
        ok: false,
        error: "Google Script fetch failed",
        details: fetchError.message
      });
    }

    return res.status(200).json({
      ok: true,
      message: "sent",
      google_response: responseText
    });

  } catch (err) {

    return res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack
    });

  }
}
