const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET' || event.httpMethod === 'HEAD') {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'ok' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const playerId = body.data?.metadata?.playerId || body.playerId;

    if (playerId) {
      const data = JSON.stringify({
        product_sku: 'FF-110-DIAMONDS',
        player_id: String(playerId),
        quantity: 1
      });

      await new Promise((resolve, reject) => {
        const req = https.request({
          hostname: 'portal.centraloneglobal.com',
          path: '/api/v1/orders',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.DIAMONDS_API_KEY}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
        }, res => {
          res.on('data', () => {});
          res.on('end', resolve);
        });
        req.on('error', reject);
        req.write(data);
        req.end();
      });
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  }
};
