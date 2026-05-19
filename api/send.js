export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {

    const url = process.env.GOOGLE_SCRIPT_URL;

    if (!url) {
      return res.status(500).json({
        ok: false,
        error: "Missing GOOGLE_SCRIPT_URL"
      });
    }

    const body = req.body || {};

    const payload = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      state: body.state,
      deliveryType: body.deliveryType,
      shipping: body.shipping,
      total: body.total,
      productName: body.productName
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
      result: text
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}
