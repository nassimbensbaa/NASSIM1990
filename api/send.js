export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      ok: false,
      message: "Method not allowed"
    });

  }

  try {

    // رابط Google Script من Vercel Environment Variables
    const GOOGLE_SCRIPT_URL =
      process.env.GOOGLE_SCRIPT_URL;

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

    // إرسال البيانات إلى Google Sheet
    const response = await fetch(
      GOOGLE_SCRIPT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({

          name: `${firstName} ${lastName}`,

          phone: phone,

          state: state,

          delivery: deliveryType === "home"
            ? "منزل"
            : "مكتب",

          shipping: shipping,

          total: total,

          product: productName

        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      sheet: data
    });

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }

}
