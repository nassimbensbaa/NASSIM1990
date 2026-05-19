export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Only POST" });
  }

  try {

    const url = process.env.GOOGLE_SCRIPT_URL;

    if (!url) {
      return res.status(500).json({
        ok: false,
        message: "Missing GOOGLE_SCRIPT_URL"
      });
    }

    const body = req.body;

    const payload = {
      name: `${body.firstName || ""} ${body.lastName || ""}`.trim(),
      phone: body.phone || "",
      state: body.state || "",
      delivery: body.deliveryType || "",
      shipping: body.shipping || 0,
      total: body.total || 0,
      product: body.productName || ""
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    return res.status(200).json({
      ok: true,
      response: text
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
