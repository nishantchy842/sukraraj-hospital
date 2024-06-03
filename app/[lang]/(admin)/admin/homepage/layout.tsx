export const metadata = {
   title: 'Home Page | Admin Panel',
};

type Props = {
   children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
   return children;
}
