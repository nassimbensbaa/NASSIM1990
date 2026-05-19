export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {

    const URL = process.env.GOOGLE_SCRIPT_URL;

    if (!URL) {
      return res.status(500).json({
        ok: false,
        error: "Missing GOOGLE_SCRIPT_URL"
      });
    }

    const body = req.body;

    const payload = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      state: body.state,
      delivery: body.deliveryType,
      shipping: body.shipping,
      total: body.total,
      product: body.productName
    };

    const r = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await r.text();

    return res.status(200).json({
      ok: true,
      response: text
    });

  } catch (err) {

    return res.status(500).json({
      ok: false,
      error: err.message
    });

  }
}
