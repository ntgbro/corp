/**
 * Script to help find the local IP address for PhonePe backend configuration
 */

const os = require('os');

console.log('=== Local IP Address Finder ===');
console.log('Use this IP address to configure your PhonePe backend URL\n');

const interfaces = os.networkInterfaces();
let foundIP = false;

Object.keys(interfaces).forEach(interfaceName => {
  const interface = interfaces[interfaceName];
  
  interface.forEach(address => {
    // Skip internal (loopback) addresses and IPv6 addresses
    if (!address.internal && address.family === 'IPv4') {
      console.log(`Interface: ${interfaceName}`);
      console.log(`IP Address: ${address.address}`);
      console.log(`Netmask: ${address.netmask}`);
      console.log(`CIDR: ${address.cidr}\n`);
      foundIP = true;
    }
  });
});

if (!foundIP) {
  console.log('No external IPv4 addresses found.');
  console.log('You might be using a VPN or have unusual network configuration.');
  console.log('Try using one of these common local IP address formats:');
  console.log('- 192.168.x.x');
  console.log('- 10.x.x.x');
  console.log('- 172.16.x.x to 172.31.x.x');
}

console.log('\n=== Configuration Instructions ===');
console.log('1. Copy one of the IP addresses above');
console.log('2. Update src/config/env.ts with your IP address:');
console.log('   return \'YOUR_IP_ADDRESS_HERE\'; // Replace with your actual local IP');
console.log('3. Make sure your mobile device is on the same network');
console.log('4. Start the PhonePe backend service: yarn phonepe-backend');