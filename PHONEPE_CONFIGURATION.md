# PhonePe Integration Configuration Guide

This guide will help you configure the PhonePe integration for CorpEase.

## Prerequisites

1. A PhonePe merchant account (sandbox for testing, production for live transactions)
2. Access to the PhonePe merchant dashboard
3. Your development environment set up with Node.js

## Configuration Steps

### 1. Get Your API Credentials

Log in to your PhonePe merchant dashboard and obtain the following credentials:

- **Merchant ID**: This is your unique identifier for your merchant account.
- **Secret Key (PHONEPE_SALT)**: This is the encryption key used to secure transactions.
- **Salt Index (PHONEPE_SALT_INDEX)**: This is an index associated with your secret key.

### 2. Update Environment Variables

Update your [.env](file:///d:/corpease/.env) file with the credentials obtained from the PhonePe dashboard:

```env
PHONEPE_BACKEND_URL=http://192.168.0.5:3001
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_SALT=your_secret_key_here
PHONEPE_SALT_INDEX=your_salt_index_here
```

Replace the placeholder values with your actual credentials.

### 3. Configure PhonePe Dashboard

In your PhonePe merchant dashboard:

1. Navigate to the API/Developer settings section.
2. Enter your Merchant ID.
3. Upload or enter your Secret Key.
4. Set the Salt Index.
5. Save the configuration.

### 4. Restart Your Backend

After updating the environment variables, restart your PhonePe backend service:

```bash
yarn phonepe-backend
```

Or if you're running it directly:

```bash
node src/scripts/phonepe-backend.js
```

### 5. Test the Integration

Try initiating a payment through the app to verify that the integration is working correctly.

## Troubleshooting

### KEY_NOT_CONFIGURED Error

If you encounter this error:

1. Double-check that your Merchant ID, Secret Key, and Salt Index in the [.env](file:///d:/corpease/.env) file match exactly with what's configured in the PhonePe dashboard.
2. Ensure that you've saved the configuration in the PhonePe dashboard.
3. Restart your backend service after making any changes to the environment variables.
4. If the problem persists, contact PhonePe support to verify that your merchant account is properly configured for API access.

### Other Issues

- Ensure that your backend service is accessible from your mobile device (same network, correct IP address).
- Check the backend logs for any error messages.
- Verify that you're using the correct environment (sandbox vs. production).

## Security Notes

- Never commit your [.env](file:///d:/corpease/.env) file to version control. It's already in [.gitignore](file:///d:/corpease/.gitignore) for this project.
- In production, consider using more secure methods to manage secrets, such as environment-specific configuration management systems.