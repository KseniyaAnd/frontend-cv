import { GraphQLProvider } from './src/shared/api/graphql';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GraphQLProvider>{children}</GraphQLProvider>
      </body>
    </html>
  );
}
