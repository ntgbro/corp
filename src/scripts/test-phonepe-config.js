/**
 * PhonePe Configuration Test Script
 * 
 * This script helps verify that your PhonePe configuration is correct
 * by checking the environment variables and generating a sample checksum.
 */

require('dotenv').config();
const crypto = require('crypto');

// PhonePe configuration from environment variables
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'M23M873C708FK_2511131637';
const PHONEPE_SALT = process.env.PHONEPE_SALT || 'MTRjODI0MjYtZDRhZi00M2I5LWEzN2ItYmQ1YTg4MGRiOWU4';
const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

console.log('=== PhonePe Configuration Test ===');
console.log('MERCHANT_ID:', MERCHANT_ID);
console.log('PHONEPE_SALT:', PHONEPE_SALT);
console.log('PHONEPE_SALT_INDEX:', PHONEPE_SALT_INDEX);
console.log('');

// Create a sample payload
const samplePayload = {
  merchantId: MERCHANT_ID,
  merchantTransactionId: 'TEST_ORDER_123',
  merchantUserId: 'TEST_USER_456',
  amount: 10000, // 100 INR in paise
  redirectUrl: 'http://localhost:3001/payment/callback',
  redirectMode: 'POST',
  callbackUrl: 'http://localhost:3001/payment/callback',
  mobileNumber: '9999999999',
  paymentInstrument: {
    type: 'PAY_PAGE'
  }
};

console.log('Sample Payload:');
console.log(JSON.stringify(samplePayload, null, 2));
console.log('');

// Corrected function to generate checksum
const generateChecksum = (data, salt, saltIndex, apiPath) => {
  try {
    // canonical JSON -> base64
    const payloadString = JSON.stringify(data);
    const base64Encoded = Buffer.from(payloadString, 'utf8').toString('base64');

    // PhonePe expects: sha256( base64(payload) + path + salt )
    // apiPath must be exactly the path used in PhonePe API docs, e.g. '/pg/v1/pay'
    const stringToHash = base64Encoded + apiPath + salt;
    const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');

    // Append salt index if PhonePe expects it (most examples do)
    const checksum = `${sha256}###${saltIndex}`;

    return checksum;
  } catch (error) {
    console.error('Error generating checksum:', error);
    throw error;
  }
};

// Generate checksum with the correct API path
const apiPath = '/pg/v1/pay';
const checksum = generateChecksum(samplePayload, PHONEPE_SALT, PHONEPE_SALT_INDEX, apiPath);

console.log('Generated Checksum:');
console.log(checksum);
console.log('');

console.log('=== Configuration Verification ===');
console.log('1. Check that the MERCHANT_ID matches exactly with your PhonePe dashboard');
console.log('2. Check that the PHONEPE_SALT matches exactly with your PhonePe dashboard');
console.log('3. Check that the PHONEPE_SALT_INDEX matches exactly with your PhonePe dashboard');
console.log('4. Ensure these values are configured in the PhonePe Sandbox Dashboard at https://mercury-uat.phonepe.com/');
console.log('5. If still getting KEY_NOT_CONFIGURED error, contact PhonePe support to provision your merchant account');