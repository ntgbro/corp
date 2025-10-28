// Country codes and phone number validation
export interface CountryCode {
  name: string;
  dialCode: string;
  code: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  // Top countries by usage
  { name: 'India', dialCode: '+91', code: 'IN', flag: '🇮🇳' },
  { name: 'United States', dialCode: '+1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dialCode: '+44', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', dialCode: '+1', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', dialCode: '+61', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', dialCode: '+49', code: 'DE', flag: '🇩🇪' },
  { name: 'France', dialCode: '+33', code: 'FR', flag: '🇫🇷' },
  { name: 'Japan', dialCode: '+81', code: 'JP', flag: '🇯🇵' },
  { name: 'Singapore', dialCode: '+65', code: 'SG', flag: '🇸🇬' },
  { name: 'United Arab Emirates', dialCode: '+971', code: 'AE', flag: '🇦🇪' },

  // Additional countries
  { name: 'Afghanistan', dialCode: '+93', code: 'AF', flag: '🇦🇫' },
  { name: 'Albania', dialCode: '+355', code: 'AL', flag: '🇦🇱' },
  { name: 'Algeria', dialCode: '+213', code: 'DZ', flag: '🇩🇿' },
  { name: 'Argentina', dialCode: '+54', code: 'AR', flag: '🇦🇷' },
  { name: 'Armenia', dialCode: '+374', code: 'AM', flag: '🇦🇲' },
  { name: 'Austria', dialCode: '+43', code: 'AT', flag: '🇦🇹' },
  { name: 'Azerbaijan', dialCode: '+994', code: 'AZ', flag: '🇦🇿' },
  { name: 'Bahrain', dialCode: '+973', code: 'BH', flag: '🇧🇭' },
  { name: 'Bangladesh', dialCode: '+880', code: 'BD', flag: '🇧🇩' },
  { name: 'Belgium', dialCode: '+32', code: 'BE', flag: '🇧🇪' },
  { name: 'Belarus', dialCode: '+375', code: 'BY', flag: '🇧🇾' },
  { name: 'Brazil', dialCode: '+55', code: 'BR', flag: '🇧🇷' },
  { name: 'Bulgaria', dialCode: '+359', code: 'BG', flag: '🇧🇬' },
  { name: 'Cambodia', dialCode: '+855', code: 'KH', flag: '🇰🇭' },
  { name: 'Chile', dialCode: '+56', code: 'CL', flag: '🇨🇱' },
  { name: 'China', dialCode: '+86', code: 'CN', flag: '🇨🇳' },
  { name: 'Colombia', dialCode: '+57', code: 'CO', flag: '🇨🇴' },
  { name: 'Croatia', dialCode: '+385', code: 'HR', flag: '🇭🇷' },
  { name: 'Cyprus', dialCode: '+357', code: 'CY', flag: '🇨🇾' },
  { name: 'Czech Republic', dialCode: '+420', code: 'CZ', flag: '🇨🇿' },
  { name: 'Denmark', dialCode: '+45', code: 'DK', flag: '🇩🇰' },
  { name: 'Egypt', dialCode: '+20', code: 'EG', flag: '🇪🇬' },
  { name: 'Estonia', dialCode: '+372', code: 'EE', flag: '🇪🇪' },
  { name: 'Finland', dialCode: '+358', code: 'FI', flag: '🇫🇮' },
  { name: 'Georgia', dialCode: '+995', code: 'GE', flag: '🇬🇪' },
  { name: 'Greece', dialCode: '+30', code: 'GR', flag: '🇬🇷' },
  { name: 'Hong Kong', dialCode: '+852', code: 'HK', flag: '🇭🇰' },
  { name: 'Hungary', dialCode: '+36', code: 'HU', flag: '🇭🇺' },
  { name: 'Iceland', dialCode: '+354', code: 'IS', flag: '🇮🇸' },
  { name: 'Indonesia', dialCode: '+62', code: 'ID', flag: '🇮🇩' },
  { name: 'Iran', dialCode: '+98', code: 'IR', flag: '🇮🇷' },
  { name: 'Iraq', dialCode: '+964', code: 'IQ', flag: '🇮🇶' },
  { name: 'Ireland', dialCode: '+353', code: 'IE', flag: '🇮🇪' },
  { name: 'Israel', dialCode: '+972', code: 'IL', flag: '🇮🇱' },
  { name: 'Italy', dialCode: '+39', code: 'IT', flag: '🇮🇹' },
  { name: 'Jordan', dialCode: '+962', code: 'JO', flag: '🇯🇴' },
  { name: 'Kazakhstan', dialCode: '+7', code: 'KZ', flag: '🇰🇿' },
  { name: 'Kenya', dialCode: '+254', code: 'KE', flag: '🇰🇪' },
  { name: 'Kuwait', dialCode: '+965', code: 'KW', flag: '🇰🇼' },
  { name: 'Kyrgyzstan', dialCode: '+996', code: 'KG', flag: '🇰🇬' },
  { name: 'Latvia', dialCode: '+371', code: 'LV', flag: '🇱🇻' },
  { name: 'Lebanon', dialCode: '+961', code: 'LB', flag: '🇱🇧' },
  { name: 'Lithuania', dialCode: '+370', code: 'LT', flag: '🇱🇹' },
  { name: 'Luxembourg', dialCode: '+352', code: 'LU', flag: '🇱🇺' },
  { name: 'Malaysia', dialCode: '+60', code: 'MY', flag: '🇲🇾' },
  { name: 'Maldives', dialCode: '+960', code: 'MV', flag: '🇲🇻' },
  { name: 'Malta', dialCode: '+356', code: 'MT', flag: '🇲🇹' },
  { name: 'Mexico', dialCode: '+52', code: 'MX', flag: '🇲🇽' },
  { name: 'Mongolia', dialCode: '+976', code: 'MN', flag: '🇲🇳' },
  { name: 'Morocco', dialCode: '+212', code: 'MA', flag: '🇲🇦' },
  { name: 'Myanmar', dialCode: '+95', code: 'MM', flag: '🇲🇲' },
  { name: 'Nepal', dialCode: '+977', code: 'NP', flag: '🇳🇵' },
  { name: 'Netherlands', dialCode: '+31', code: 'NL', flag: '🇳🇱' },
  { name: 'New Zealand', dialCode: '+64', code: 'NZ', flag: '🇳🇿' },
  { name: 'Nigeria', dialCode: '+234', code: 'NG', flag: '🇳🇬' },
  { name: 'Norway', dialCode: '+47', code: 'NO', flag: '🇳🇴' },
  { name: 'Oman', dialCode: '+968', code: 'OM', flag: '🇴🇲' },
  { name: 'Pakistan', dialCode: '+92', code: 'PK', flag: '🇵🇰' },
  { name: 'Palestine', dialCode: '+970', code: 'PS', flag: '🇵🇸' },
  { name: 'Peru', dialCode: '+51', code: 'PE', flag: '🇵🇪' },
  { name: 'Philippines', dialCode: '+63', code: 'PH', flag: '🇵🇭' },
  { name: 'Poland', dialCode: '+48', code: 'PL', flag: '🇵🇱' },
  { name: 'Portugal', dialCode: '+351', code: 'PT', flag: '🇵🇹' },
  { name: 'Qatar', dialCode: '+974', code: 'QA', flag: '🇶🇦' },
  { name: 'Romania', dialCode: '+40', code: 'RO', flag: '🇷🇴' },
  { name: 'Russia', dialCode: '+7', code: 'RU', flag: '🇷🇺' },
  { name: 'Saudi Arabia', dialCode: '+966', code: 'SA', flag: '🇸🇦' },
  { name: 'Serbia', dialCode: '+381', code: 'RS', flag: '🇷🇸' },
  { name: 'Slovakia', dialCode: '+421', code: 'SK', flag: '🇸🇰' },
  { name: 'Slovenia', dialCode: '+386', code: 'SI', flag: '🇸🇮' },
  { name: 'South Africa', dialCode: '+27', code: 'ZA', flag: '🇿🇦' },
  { name: 'South Korea', dialCode: '+82', code: 'KR', flag: '🇰🇷' },
  { name: 'Spain', dialCode: '+34', code: 'ES', flag: '🇪🇸' },
  { name: 'Sri Lanka', dialCode: '+94', code: 'LK', flag: '🇱🇰' },
  { name: 'Sweden', dialCode: '+46', code: 'SE', flag: '🇸🇪' },
  { name: 'Switzerland', dialCode: '+41', code: 'CH', flag: '🇨🇭' },
  { name: 'Taiwan', dialCode: '+886', code: 'TW', flag: '🇹🇼' },
  { name: 'Tanzania', dialCode: '+255', code: 'TZ', flag: '🇹🇿' },
  { name: 'Thailand', dialCode: '+66', code: 'TH', flag: '🇹🇭' },
  { name: 'Tunisia', dialCode: '+216', code: 'TN', flag: '🇹🇳' },
  { name: 'Turkey', dialCode: '+90', code: 'TR', flag: '🇹🇷' },
  { name: 'Turkmenistan', dialCode: '+993', code: 'TM', flag: '🇹🇲' },
  { name: 'Ukraine', dialCode: '+380', code: 'UA', flag: '🇺🇦' },
  { name: 'Uruguay', dialCode: '+598', code: 'UY', flag: '🇺🇾' },
  { name: 'Uzbekistan', dialCode: '+998', code: 'UZ', flag: '🇺🇿' },
  { name: 'Venezuela', dialCode: '+58', code: 'VE', flag: '🇻🇪' },
  { name: 'Vietnam', dialCode: '+84', code: 'VN', flag: '🇻🇳' },
  { name: 'Yemen', dialCode: '+967', code: 'YE', flag: '🇾🇪' },
  { name: 'Zimbabwe', dialCode: '+263', code: 'ZW', flag: '🇿🇼' },
];

// Helper functions
export const getCountryByCode = (code: string): CountryCode | undefined => {
  return COUNTRY_CODES.find(country => country.code === code);
};

export const getCountryByDialCode = (dialCode: string): CountryCode | undefined => {
  return COUNTRY_CODES.find(country => country.dialCode === dialCode);
};

export const searchCountries = (query: string): CountryCode[] => {
  const lowerQuery = query.toLowerCase();
  return COUNTRY_CODES.filter(country =>
    country.name.toLowerCase().includes(lowerQuery) ||
    country.dialCode.includes(query) ||
    country.code.toLowerCase().includes(lowerQuery)
  );
};

export const getDefaultCountry = (): CountryCode => {
  // Return India as default for Corpease
  return COUNTRY_CODES[0]; // India
};

export default COUNTRY_CODES;
