const fs = require('fs');
const path = require('path');

const structure = {
  'src': {
    'App.tsx': '',
    'assets': {
      'fonts': {},
      'images': {
        'products': {},
        'categories': {},
        'orders': {}
      },
      'icons': {},
      'animations': {}
    },
    'components': {
      'common': {},
      'layout': {},
      'firebase': {}
    },
    'config': {},
    'services': {
      'firebase': {
        'auth': {},
        'firestore': {},
        'storage': {},
        'messaging': {},
        'analytics': {},
        'functions': {}
      },
      'api': {},
      'permissions': {}
    },
    'features': {
      'auth': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'cart': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'home': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'orders': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'payment': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'product': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'profile': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'chef': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'notifications': {
        'components': {},
        'screens': {},
        'hooks': {}
      },
      'settings': {
        'components': {},
        'screens': {},
        'address': {
          'components': {},
          'screens': {},
          'hooks': {}
        }
      },
      'splash': {}
    },
    'contexts': {},
    'hooks': {},
    'navigation': {},
    'store': {
      'slices': {},
      'middleware': {}
    },
    'utils': {
      'firebase': {}
    },
    'constants': {
      'firebase': {}
    },
    'types': {}
  }
};

function createStructure(obj, basePath = '') {
  Object.keys(obj).forEach(key => {
    const currentPath = path.join(basePath, key);
    
    if (key.endsWith('.tsx') || key.endsWith('.ts') || key.endsWith('.js')) {
      // Create file
      fs.writeFileSync(currentPath, obj[key] || '');
      console.log(`Created file: ${currentPath}`);
    } else {
      // Create directory
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
        console.log(`Created directory: ${currentPath}`);
      }
      
      // Recursively create subdirectories and files
      if (typeof obj[key] === 'object') {
        createStructure(obj[key], currentPath);
      }
    }
  });
}

// Run the script
console.log('Creating React Native project structure...\n');
createStructure(structure);
console.log('\n✅ Project structure created successfully!');
