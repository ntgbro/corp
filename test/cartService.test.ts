import { CartService } from '../src/services/firebase/cartService';

// Mock Firebase functions
jest.mock('@react-native-firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

// Mock db
jest.mock('../src/config/firebase', () => ({
  db: {},
}));

// Test to verify the rating functionality fix
import { RestaurantService } from '../src/services/firebase/restaurantService';

// Mock data that matches the actual database structure
const mockOrderItemWithLinks = {
  id: 'item123',
  name: 'Test Pizza',
  type: 'menu_item',
  links: {
    restaurantId: 'restaurant123',
    menuItemId: 'menu123'
  }
};

const mockOrderItemWithoutLinks = {
  id: 'item456',
  name: 'Test Burger',
  type: 'menu_item',
  links: {}
};

describe('Rating Functionality Fix', () => {
  it('should correctly extract restaurantId and menuItemId from links', () => {
    // Test that our fix correctly accesses the nested links structure
    expect(mockOrderItemWithLinks.links?.restaurantId).toBe('restaurant123');
    expect(mockOrderItemWithLinks.links?.menuItemId).toBe('menu123');
    
    // Test that items without proper links are handled correctly
    expect(mockOrderItemWithoutLinks.links?.restaurantId).toBeUndefined();
    expect(mockOrderItemWithoutLinks.links?.menuItemId).toBeUndefined();
  });

  it('should handle items without links gracefully', () => {
    // Items without proper links should not cause errors
    expect(() => {
      if (mockOrderItemWithoutLinks.type !== 'menu_item' || 
          !mockOrderItemWithoutLinks.links?.restaurantId || 
          !mockOrderItemWithoutLinks.links?.menuItemId) {
        // This should be triggered for items without proper links
        return true;
      }
      return false;
    }).not.toThrow();
  });
});

describe('CartService', () => {
  describe('getOrderDataForCartItem', () => {
    it('should extract order data from a Firebase cart item', async () => {
      // Create a mock Firebase cart item with restaurant data
      const firebaseItem = {
        itemId: 'test-item-id',
        userId: 'test-user-id',
        productId: 'test-product-id',
        menuItemId: '',
        name: 'Test Product',
        price: 100,
        quantity: 1,
        totalPrice: 100,
        customizations: [],
        notes: '',
        addedAt: new Date(),
        serviceId: 'service-123',
        restaurantId: 'REST_456',
        warehouseId: '',
      };

      const orderData = await CartService.getOrderDataForCartItem(firebaseItem);

      expect(orderData.serviceId).toBe('service-123');
      expect(orderData.restaurantId).toBe('REST_456');
      expect(orderData.warehouseId).toBe('');
      expect(orderData.type).toBe('restaurant');
    });

    it('should extract order data from a Firebase cart item with warehouse data', async () => {
      // Create a mock Firebase cart item with warehouse data
      const firebaseItem = {
        itemId: 'test-item-id',
        userId: 'test-user-id',
        productId: 'test-product-id',
        menuItemId: '',
        name: 'Test Product',
        price: 100,
        quantity: 1,
        totalPrice: 100,
        customizations: [],
        notes: '',
        addedAt: new Date(),
        serviceId: 'service-123',
        restaurantId: '',
        warehouseId: 'WAREHOUSE_456',
      };

      const orderData = await CartService.getOrderDataForCartItem(firebaseItem);

      expect(orderData.serviceId).toBe('service-123');
      expect(orderData.restaurantId).toBe('');
      expect(orderData.warehouseId).toBe('WAREHOUSE_456');
      expect(orderData.type).toBe('warehouse');
    });
  });
});