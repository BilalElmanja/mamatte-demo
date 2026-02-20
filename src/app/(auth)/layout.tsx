import { FloatingOrbs } from "./_components/floating-orbs";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-cream">
      {/* Background orbs */}
      <FloatingOrbs />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-12">
        {children}
      </div>
    </div>
  );
}
