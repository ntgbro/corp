import { useState, useEffect } from 'react';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we might fetch FAQs from Firebase or an API
    // For now, we'll use static data
    const staticFaqs: FAQ[] = [
      {
        id: '1',
        question: 'How do I place an order?',
        answer: 'To place an order, browse through our products, add items to your cart, and proceed to checkout. You can select your preferred payment method and delivery time slot during checkout.',
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, UPI payments, and digital wallets like PayPal and Google Pay.',
      },
      {
        id: '3',
        question: 'How long does delivery take?',
        answer: 'Delivery typically takes 30-45 minutes for food items and 1-2 hours for grocery items, depending on your location and order size.',
      },
      {
        id: '4',
        question: 'Can I cancel or modify my order?',
        answer: 'You can cancel your order within 10 minutes of placing it. After that, please contact our customer support team for assistance.',
      },
      {
        id: '5',
        question: 'How do I track my order?',
        answer: 'You can track your order status in real-time through the "Orders" section in your account. You will also receive notifications at each stage of the delivery process.',
      },
      {
        id: '6',
        question: 'What is your return policy?',
        answer: 'We offer a 100% satisfaction guarantee. If you are not satisfied with your purchase, please contact us within 24 hours of delivery for a full refund or replacement.',
      },
    ];

    // Simulate fetching FAQs
    setLoading(true);
    setTimeout(() => {
      setFaqs(staticFaqs);
      setLoading(false);
    }, 500);
  }, []);

  return {
    faqs,
    loading,
  };
};