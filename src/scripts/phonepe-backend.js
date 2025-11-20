const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

// === SECURE FIREBASE INITIALIZATION ===
let serviceAccount;

try {
  // Option 1: Production (Read from Environment Variable)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Loading Firebase credentials from Environment Variable...');
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } 
  // Option 2: Local Development (Read from File)
  else {
    console.log('Loading Firebase credentials from local file...');
    serviceAccount = require('../../service-account-key.json');
  }

  // Initialize Firebase
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin Initialized Securely');
  }
} catch (error) {
  console.error('❌ Firebase Auth Failed:', error.message);
  console.error('CRITICAL: You must set FIREBASE_SERVICE_ACCOUNT in .env or have service-account-key.json locally.');
  process.exit(1); // Stop server if we can't talk to database
}

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// === CRITICAL FIX: Allow Express to read Form Data (PhonePe Callback) ===
app.use(express.urlencoded({ extended: false })); 

// === CONFIGURATION ===
const MERCHANT_ID = 'PGTESTPAYUAT86';
const PHONEPE_SALT = '96434309-7796-489d-8924-ab56988a6076';
const PHONEPE_SALT_INDEX = '1';
const PHONEPE_API_URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay';
const PHONEPE_BACKEND_URL = process.env.PHONEPE_BACKEND_URL || `http://192.168.0.4:${PORT}`;

console.log('=== PhonePe Service Starting (Sanitized) ===');
console.log('MERCHANT_ID:', MERCHANT_ID);
console.log('SALT Last 4 chars:', PHONEPE_SALT.slice(-4)); 
console.log('==========================================');

const generateChecksum = (base64Body, salt, saltIndex, apiPath) => {
  const stringToHash = base64Body + apiPath + salt;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${saltIndex}`;
};

app.post('/generate-payment-request', async (req, res) => {
  try {
    const { amount, orderId, customerId, redirectUrl, callbackUrl } = req.body;
    
    if (!amount || !orderId || !customerId) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: orderId,
      merchantUserId: customerId,
      amount: amount * 100, 
      redirectUrl: redirectUrl || `${PHONEPE_BACKEND_URL}/payment/callback`,
      redirectMode: 'POST',
      callbackUrl: callbackUrl || `${PHONEPE_BACKEND_URL}/payment/callback`,
      mobileNumber: '9999999999',
      paymentInstrument: { type: 'PAY_PAGE' }
    };

    const payloadString = JSON.stringify(payload);
    const base64Payload = Buffer.from(payloadString, 'utf8').toString('base64');
    const apiPath = '/pg/v1/pay';
    const checksum = generateChecksum(base64Payload, PHONEPE_SALT, PHONEPE_SALT_INDEX, apiPath);
    
    console.log(`Initiating Payment for ${orderId}...`);

    try {
      const phonepeResponse = await axios.post(
        PHONEPE_API_URL,
        { request: base64Payload },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': MERCHANT_ID
          }
        }
      );

      if (phonepeResponse.data.success) {
        res.json({
          success: true,
          data: {
            requestId: orderId,
            merchantId: MERCHANT_ID,
            payload: base64Payload,
            checksum: checksum,
            paymentUrl: phonepeResponse.data.data.instrumentResponse.redirectInfo.url 
          }
        });
      } else {
        throw new Error('PhonePe responded with success:false');
      }
    } catch (apiError) {
      console.error('❌ PhonePe API Error (Using Simulator Fallback):', apiError.message);
      const simulatorUrl = `https://mercury-uat.phonepe.com/transact/simulator?request=${encodeURIComponent(base64Payload)}&checksum=${encodeURIComponent(checksum)}`;
      res.json({ success: true, data: { requestId: orderId, paymentUrl: simulatorUrl } });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// === CALLBACK HANDLER (FIXED) ===
app.post('/payment/callback', async (req, res) => {
  try {
    console.log('Raw Callback Body:', JSON.stringify(req.body, null, 2));
    
    let callbackData;

    // 1. Handle Base64 Encoded Response (Standard PhonePe Format)
    if (req.body.response) {
      const decodedResponse = Buffer.from(req.body.response, 'base64').toString('utf-8');
      callbackData = JSON.parse(decodedResponse);
      console.log('Decoded Callback JSON:', JSON.stringify(callbackData, null, 2));
    } 
    // 2. Handle Direct JSON (Some Simulator modes)
    else {
      callbackData = req.body;
    }

    // 3. Extract Data safely
    const data = callbackData.data || callbackData; // PhonePe sometimes wraps in 'data'
    const orderId = data.merchantTransactionId || data.transactionId;
    const paymentStatus = data.code || data.status || 'UNKNOWN';
    const gatewayTransactionId = data.providerReferenceId || '';

    if (!orderId) {
      console.error('❌ Error: No Order ID found in callback');
      return res.status(400).json({ success: false, message: 'Invalid callback data' });
    }

    console.log(`Processing Order: ${orderId} | Status: ${paymentStatus}`);

    // 4. Update Firebase
    const orderRef = db.collection('orders').doc(orderId);
    
    // Map Status
    let orderStatus = 'pending';
    let paymentStatusFirestore = 'pending';

    if (paymentStatus === 'PAYMENT_SUCCESS' || paymentStatus === 'SUCCESS') {
      orderStatus = 'confirmed';
      paymentStatusFirestore = 'paid';
    } else if (paymentStatus === 'PAYMENT_ERROR' || paymentStatus === 'PAYMENT_FAILURE' || paymentStatus === 'FAILED') {
      orderStatus = 'cancelled';
      paymentStatusFirestore = 'failed';
    }

    // Update Main Order
    await orderRef.update({
      status: orderStatus,
      paymentStatus: paymentStatusFirestore,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Save Transaction Details
    await orderRef.collection('payment').add({
      status: paymentStatusFirestore,
      gatewayTransactionId: gatewayTransactionId,
      rawResponse: callbackData, // Save full log for debugging
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Successfully updated Order ${orderId} to ${orderStatus}`);
    
    res.json({ success: true });

  } catch (error) {
    console.error('❌ Error processing callback:', error);
    res.status(500).json({ success: false, message: 'Internal Error' });
  }
});

// GET Callback (Fallback)
app.get('/payment/callback', (req, res) => {
  console.log('GET Callback received (ignored). Expecting POST.');
  res.send('Payment processing...');
});

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});