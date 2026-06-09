export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { paymentId, txid } = req.body;
  if (!paymentId || !txid) {
    return res.status(400).json({ error: 'Missing paymentId or txid in request body' });
  }

  const PI_API_KEY = process.env.PI_API_KEY;
  if (!PI_API_KEY) {
    console.error("PI_API_KEY environment variable is missing.");
    return res.status(500).json({ error: 'Server configuration error' });
  }
  
  try {
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${PI_API_KEY}`
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Complete failed from Pi Network:", data);
      return res.status(response.status).json(data);
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error("Internal API Error during completion:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
