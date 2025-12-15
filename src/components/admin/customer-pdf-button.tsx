"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CustomerPdf } from "./customer-pdf";
import { useEffect, useState } from "react";

export function CustomerPdfButton({ user }: { user: any }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <PDFDownloadLink
            document={<CustomerPdf user={user} />}
            fileName={`customer-${user.name?.toLowerCase().replace(/\s+/g, '-') || 'db'}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button variant="outline" size="icon" disabled={loading} title="Download PDF Report">
                    <Download className="h-4 w-4" />
                </Button>
            )}
        </PDFDownloadLink>
    );
}
