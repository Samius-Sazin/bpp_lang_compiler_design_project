export const metadata = {
  title: 'b++ Web IDE',
  description: 'A modern web IDE for the b++ language',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
