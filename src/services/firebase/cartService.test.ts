import { CartService } from './cartService';

// Mock Firebase
const mockDoc = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockGetDocs = jest.fn();
const mockSetDoc = jest.fn();
const mockUpdateDoc = jest.fn();
const mockDeleteDoc = jest.fn();

jest.mock('@react-native-firebase/firestore', () => ({
  collection: mockCollection,
  doc: mockDoc,
  query: mockQuery,
  where: mockWhere,
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
}));

describe('CartService', () => {
  const userId = 'test-user-id';
  const cartId = 'test-cart-id';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart when it exists', async () => {
      const mockCartDoc = {
        id: cartId,
        data: () => ({
          userId,
          itemCount: 2,
          totalAmount: 20,
          status: 'active',
        }),
      };
      
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [mockCartDoc],
      });
      
      const result = await CartService.getCart(userId);
      
      expect(result).toEqual({
        cartId,
        userId,
        itemCount: 2,
        totalAmount: 20,
        status: 'active',
      });
    });
    
    it('should return null when no cart exists', async () => {
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: [],
      });
      
      const result = await CartService.getCart(userId);
      
      expect(result).toBeNull();
    });
  });

  describe('addItemToCart', () => {
    it('should add new item to cart', async () => {
      // Mock that item doesn't exist yet
      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: [],
      });
      
      const item = {
        productId: 'product-123',
        name: 'Test Product',
        price: 10,
      };
      
      await CartService.addItemToCart(userId, cartId, item as any);
      
      // Should create new item
      expect(mockSetDoc).toHaveBeenCalled();
      // Should update cart totals
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });
});