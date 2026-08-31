"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { opsStorage } from "@/lib/api/storage";
import { Invoice } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, CheckCircle2, ShieldCheck, Lock, ChevronLeft, Building } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const invoices = opsStorage.getInvoices();
    
    // In Next.js 15, params is a Promise, so we must unwrap it using React.use
    // Since we're in a useEffect, we can't directly use React.use. 
    // Wait, since this is a client component, Next.js provides `params` as a Promise in Next.js 15
    // Actually, Next.js recommends using React.use(params) in the render body.
    
    // Instead of doing it here, we will fix it below. But for now let's just do an async unwrap if it's a promise
    Promise.resolve(params).then((p) => {
      const found = invoices.find(inv => inv.id === p.id);
      if (found) {
        setInvoice(found);
      }
    });
  }, [params]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network delay and processing
    setTimeout(() => {
      if (invoice) {
        // Update Invoice
        const updatedInvoice = { ...invoice, status: "Paid" as any };
        const invoices = opsStorage.getInvoices();
        const newInvoices = invoices.map(inv => inv.id === invoice.id ? updatedInvoice : inv);
        opsStorage.saveInvoices(newInvoices);

        // Add payment record
        const payments = opsStorage.getPayments();
        const newPayment = {
          id: `PAY-${Date.now()}`,
          bookingId: invoice.bookingId,
          customerName: invoice.customerName,
          date: new Date().toISOString(),
          amount: invoice.totalAmount,
          method: invoice.paymentMethod,
          status: "Paid" as any,
        };
        opsStorage.savePayments([newPayment as any, ...payments]);

        // Add activity log
        opsStorage.addActivityLog({
          user: "System",
          action: "Payment Received",
          description: `Payment of ${formatCurrency(invoice.totalAmount)} received for invoice ${invoice.id}`,
          type: "Payment",
        });

        setIsProcessing(false);
        setIsSuccess(true);
        toast.success("Payment successful!");

        setTimeout(() => {
          router.push("/user/invoices");
        }, 3000);
      }
    }, 2000);
  };

  if (!mounted) return null;

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-white">Invoice not found</h2>
        <Button variant="link" onClick={() => router.push("/user/invoices")}>Return to Invoices</Button>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Thank you for your payment of <strong className="text-white">{formatCurrency(invoice.totalAmount)}</strong>. 
          Your invoice {invoice.id} has been marked as paid.
        </p>
        <Button onClick={() => router.push("/user/invoices")} variant="outline">
          Return to Invoices
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4 text-muted-foreground hover:text-white">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-border/40 pb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Details
                </CardTitle>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Secure Checkout
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <form id="payment-form" onSubmit={handlePayment} className="space-y-6">
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Cardholder Name</label>
                    <Input required placeholder="Name on card" className="bg-background/50 border-border/50 h-11" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input required placeholder="0000 0000 0000 0000" maxLength={19} className="bg-background/50 border-border/50 h-11 pl-10 font-mono" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                      <Input required placeholder="MM/YY" maxLength={5} className="bg-background/50 border-border/50 h-11" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">CVC</label>
                      <Input required placeholder="123" maxLength={4} type="password" className="bg-background/50 border-border/50 h-11" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Payments are securely processed. We do not store your full card details. 
                    By confirming this payment, you agree to our terms of service and billing policies.
                  </p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/40 p-6">
              <Button 
                type="submit" 
                form="payment-form" 
                disabled={isProcessing} 
                className="w-full h-12 text-base font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all"
              >
                {isProcessing ? "Processing Payment..." : `Pay ${formatCurrency(invoice.totalAmount)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-card border-border/50 shadow-md sticky top-24">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="text-base">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Invoice No.</span>
                  <span className="font-mono text-white">{invoice.id}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Due Date</span>
                  <span className="text-white">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-white">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="text-white">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">Total Amount</span>
                  <span className="font-bold text-xl text-emerald-400">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-md p-3">
                  <p className="text-xs text-amber-500/90 leading-relaxed text-center">
                    <strong className="block mb-1">Disclaimer</strong>
                    This payment flow is for reference and demonstration purposes only. It is not a final or actual transaction.
                  </p>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
