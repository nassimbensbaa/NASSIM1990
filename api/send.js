export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {

    const GOOGLE_SCRIPT_URL =
      process.env.GOOGLE_SCRIPT_URL;

    if (!GOOGLE_SCRIPT_URL) {
      return res.status(500).json({
        ok: false,
        message: "Missing GOOGLE_SCRIPT_URL"
      });
    }

    const {
      firstName,
      lastName,
      phone,
      state,
      deliveryType,
      shipping,
      total,
      productName
    } = req.body;

    const payload = {
      name: `${firstName} ${lastName}`,
      phone,
      state,
      delivery: deliveryType,
      shipping,
      total,
      product: productName
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { raw: text };
    }

    return res.status(200).json({
      ok: true,
      google: result
    });

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }
}
