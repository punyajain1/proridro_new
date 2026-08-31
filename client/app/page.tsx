import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, User, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">Welcome to Proridro</h1>
          <p className="text-muted-foreground text-lg">Select a dashboard to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <Link href="/admin">
            <Card className="bg-card border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full group">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Admin Dashboard</h2>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Manage operations, fleet, bookings, and monitor the entire system.
                </p>



                <div className="flex items-center justify-center text-primary font-medium text-sm w-full py-2 bg-primary/10 rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  See Demo <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* <Link href="/user">
            <Card className="bg-card border-border/50 hover:border-emerald-500/50 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full group">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">User Dashboard</h2>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">
                  Book rides, manage your upcoming trips, and view invoices.
                </p>



                <div className="flex items-center justify-center text-emerald-500 font-medium text-sm w-full py-2 bg-emerald-500/10 rounded-md group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  See Demo <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
