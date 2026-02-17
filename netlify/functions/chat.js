const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const { messages } = JSON.parse(event.body);
    const apiKey = process.env.DEEPSEEK_API_KEY;

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages,
          stream: true
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return {
        statusCode: 500,
        body: err
      };
    }

    const reader = response.body;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked"
      },
      body: reader
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
