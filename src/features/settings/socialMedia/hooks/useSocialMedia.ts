import { useState, useEffect } from 'react';

export interface SocialMedia {
  id: string;
  name: string;
  icon: string;
  url: string;
  color: string;
}

export const useSocialMedia = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, we might fetch social media links from Firebase or an API
    // For now, we'll use static data
    const staticSocialMedia: SocialMedia[] = [
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'f',
        url: 'https://www.facebook.com/corpease',
        color: '#1877F2',
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 't',
        url: 'https://www.twitter.com/corpease',
        color: '#1DA1F2',
      },
      {
        id: 'instagram',
        name: 'Instagram',
        icon: 'i',
        url: 'https://www.instagram.com/corpease',
        color: '#E1306C',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'in',
        url: 'https://www.linkedin.com/company/corpease',
        color: '#0A66C2',
      },
    ];

    // Simulate fetching social media links
    setLoading(true);
    setTimeout(() => {
      setSocialMedia(staticSocialMedia);
      setLoading(false);
    }, 500);
  }, []);

  return {
    socialMedia,
    loading,
  };
};