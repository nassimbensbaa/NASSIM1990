export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Only POST allowed"
    });
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
    } = req.body || {};

    const payload = {
      name: `${firstName || ""} ${lastName || ""}`,
      phone: phone || "",
      state: state || "",
      delivery: deliveryType || "",
      shipping: shipping || 0,
      total: total || 0,
      product: productName || ""
    };

    const gsResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const text = await gsResponse.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { raw: text };
    }

    return res.status(200).json({
      ok: true,
      google: data
    });

  } catch (error) {

    console.error("SEND ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }
}
