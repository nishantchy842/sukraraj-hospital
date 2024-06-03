import type { Metadata } from 'next';
// import brandLogo from '@/public/admin/assets/brand-logo.png';

export const seoData: Metadata = {
   title: {
      default: 'Sukraraj Tropical & Infectious Disease Hospital',
      template: '%s | Sukraraj Tropical & Infectious Disease Hospital',
   },
   description: 'Sukraraj Tropical & Infectious Disease Hospital',
   openGraph: {
      title: 'Sukraraj Tropical & Infectious Disease Hospital',
      description: 'Sukraraj Tropical & Infectious Disease Hospital',
      url: '',
      siteName: 'sukrarajhospital',
      images: [
         {
            url: './public/admin/assets/brand-logo.png',
            width: 1260,
            height: 800,
         },
      ],
   },
};
