export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Only POST allowed"
    });
  }

  try {

    const BOT_TOKEN = process.env.BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;

    // رابط Google Sheet
    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbxfYw89K_o26V_7smH7a2VV7IEvkUfd2ROlWZk0eKdM5UU1610Vo8Vs29k8UT494yrg2w/exec";

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

    // =========================
    // رسالة Telegram
    // =========================

    const message = `
🌟 طلب جديد من المتجر 🌟
━━━━━━━━━━━━━━
👤 الاسم: ${firstName} ${lastName}
📞 الهاتف: ${phone}
📍 الولاية: ${state}
🚚 التوصيل: ${deliveryType === "home" ? "منزل" : "مكتب"}
💰 التوصيل: ${shipping} دج
💎 المجموع: ${Math.round(total)} دج
🛍️ المنتج: ${productName}
━━━━━━━━━━━━━━
`;

    // =========================
    // إرسال Telegram
    // =========================

    const telegramUrl =
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    const telegramRes = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    const telegramData = await telegramRes.json();

    // =========================
    // إرسال Google Sheet
    // =========================

    let sheetData = null;

    try {

      const sheetRes = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          phone: phone,
          state: state,
          product: productName
        })
      });

      sheetData = await sheetRes.json();

    } catch (sheetError) {

      console.log("Google Sheet Error:", sheetError);

    }

    // =========================
    // النتيجة
    // =========================

    return res.status(200).json({
      ok: true,
      telegram: telegramData,
      sheet: sheetData
    });

  } catch (error) {

    return res.status(500).json({
      ok: false,
      error: error.message
    });

  }

}
