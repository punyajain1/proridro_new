"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { opsStorage } from "@/lib/api/storage";
import { Invoice } from "@/lib/api/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Download, CreditCard, ExternalLink, AlertCircle } from "lucide-react";

export default function UserInvoices() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setInvoices(opsStorage.getInvoices());
  }, []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices & Payments</h1>
          <p className="text-muted-foreground text-sm">View your past invoices and clear pending payments.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <Card key={invoice.id} className={`bg-card border transition-colors overflow-hidden ${
              (invoice.status as string) === 'Overdue' ? 'border-red-500/30 shadow-[0_0_15px_-3px_rgba(239,68,68,0.1)]' : 'border-border/50 hover:border-border'
            }`}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center p-4 sm:p-6 gap-6">
                  
                  {/* Status & ID */}
                  <div className="flex-shrink-0 md:w-32">
                    <span className="text-xs font-mono text-muted-foreground block mb-1">{invoice.id}</span>
                    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium ${
                      invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400' :
                      (invoice.status as string) === 'Overdue' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {(invoice.status as string) === 'Overdue' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {invoice.status}
                    </span>
                  </div>

                  {/* Dates & Details */}
                  <div className="flex-grow space-y-3">
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Generated On</span>
                        <p className="font-medium text-sm text-white">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Due Date</span>
                        <p className={`font-medium text-sm ${(invoice.status as string) === 'Overdue' ? 'text-red-400' : 'text-white'}`}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex flex-row items-center justify-between border-t border-border/40 pt-4 mt-2 md:mt-0 md:pt-0 md:border-t-0 md:border-l md:pl-6 md:w-48 md:flex-col md:justify-center md:items-end gap-4">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-muted-foreground block mb-1">Amount</span>
                      <span className="font-bold text-xl text-white">{formatCurrency(invoice.totalAmount)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </Button>
                      {invoice.status !== 'Paid' && (
                        <Button 
                          onClick={() => router.push(`/user/payment/${invoice.id}`)}
                          className={`h-9 ${
                            (invoice.status as string) === 'Overdue' 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-xl border border-border/50">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20 text-muted-foreground" />
            <h3 className="text-lg font-medium text-white mb-1">No Invoices</h3>
            <p className="text-muted-foreground text-sm">You do not have any invoices yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
