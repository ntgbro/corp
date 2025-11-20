# PhonePe Integration Fix Instructions

You're encountering the `KEY_NOT_CONFIGURED` error because your merchant credentials are not properly configured in PhonePe's sandbox dashboard. Here's how to fix it:

## Current Configuration Status

Your local environment is correctly configured with:
- Merchant ID: `M23M873C708FK_2511131637`
- Secret Key (PHONEPE_SALT): `MTRjODI0MjYtZDRhZi00M2I5LWEzN2ItYmQ1YTg4MGRiOWU4`
- Salt Index (PHONEPE_SALT_INDEX): `1`

## Steps to Fix the Issue

### 1. Login to PhonePe Sandbox Dashboard
- URL: [https://mercury-uat.phonepe.com/](https://mercury-uat.phonepe.com/)
- Use your test merchant account credentials

### 2. Configure Your API Keys
- Navigate to **Developer** or **API Settings** section
- Look for "Encryption Key/Salt", "Secret Key", or "Key Management"
- Set the following values exactly:
  - Merchant ID: `M23M873C708FK_2511131637`
  - Secret Key: `MTRjODI0MjYtZDRhZi00M2I5LWEzN2ItYmQ1YTg4MGRiOWU4`
  - Salt Index: `1`
- Save/apply the changes

### 3. If You Can't Find These Settings
- Contact PhonePe developer support
- Request them to provision and enable your encryption key for merchant ID `M23M873C708FK_2511131637`
- Mention that you're getting a `KEY_NOT_CONFIGURED` error in the sandbox environment

## Verification Steps

### 1. Test Your Local Configuration
Run this command to verify your local environment:
```bash
yarn test-phonepe-config
```

### 2. Test Your Backend Service
After configuring the PhonePe dashboard, restart your backend and test it:
```bash
yarn phonepe-backend
# In another terminal:
yarn test-phonepe
```

## Important Notes

1. **This is a mandatory step**: You MUST configure these values in the PhonePe dashboard. The error will not resolve until this is done.
2. **Exact matching required**: The values in your [.env](file:///d:/corpease/.env) file must match exactly with what's configured in the PhonePe dashboard.
3. **Contact support if needed**: If you don't see the options to configure these values in the dashboard, you must contact PhonePe support.

## After Configuration

Once you've configured the keys in the PhonePe dashboard:
1. Restart your PhonePe backend service
2. Try initiating a payment again
3. You should now see the real PhonePe payment page instead of the error

If you continue to have issues after configuring the dashboard, please share a screenshot of the "API / Key Management" section from your PhonePe dashboard for further assistance.