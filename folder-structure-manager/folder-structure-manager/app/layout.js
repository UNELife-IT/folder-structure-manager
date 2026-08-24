import './globals.css';

export const metadata = {
  title: 'Folder Structure Manager',
  description: 'Collaborative folder structure viewer and editor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}