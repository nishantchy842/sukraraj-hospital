import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
   content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
   ],
   theme: {
      extend: {
         colors: {
            primary: '#0C62BB',
            secondary: '#B82432',
            grey50: '#505050',
            grey30: '#303030',
         },
      },
      screens: {
         '4k': '1919px',
         '2xl': { max: '1535px' },
         // => @media (max-width: 1535px) { ... }

         xl: { max: '1279px' },
         // => @media (max-width: 1279px) { ... }

         base: { max: '1250px' },

         lg: { max: '1023px' },
         // => @media (max-width: 1023px) { ... }

         md: { min: '576px', max: '767px' },
         // => @media (max-width: 767px) { ... }

         sm: { max: '575px' },
         // => @media (max-width: 639px) { ... }
      },
   },
   plugins: [
      require('@tailwindcss/typography'),
      plugin(function ({ addComponents }) {
         addComponents({
            '.admin-primary-btn': {
               backgroundColor: 'rgba(12,98,187,1)',
               borderRadius: '5px',
               padding: '0px, 24px, 0px, 24px',
               height: '50px',
               fontWeight: '500',
               fontSize: '16px',
               lineHeight: '30px',
            },
            '.admin-archive-btn': {
               backgroundColor: 'white',
               borderRadius: '5px',
               padding: '0px, 24px, 0px, 24px',
               height: '50px',
               fontWeight: '500',
               fontSize: '16px',
               lineHeight: '30px',
               border: '1px solid #B82432',
               color: '#B82432',
               '&:hover': {
                  backgroundColor: 'white !important',
                  color: '#B82432 !important',
               },
            },
            '.admin-active-btn': {
               backgroundColor: 'white',
               borderRadius: '5px',
               padding: '0px, 24px, 0px, 24px',
               height: '50px',
               fontWeight: '500',
               fontSize: '16px',
               lineHeight: '30px',
               border: '1px solid #34C38F',
               color: '#34C38F',
               '&:hover': {
                  backgroundColor: 'white !important',
                  color: '#34C38F !important',
               },
            },
         });
      }),
   ],
};
export default config;
