import { Brush } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brush className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">Printastic</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Printastic. All Rights Reserved.
            </p>
            <p className="text-xs mt-1">
              Beautiful prints for every space.
            </p>
          </div>
        </div>
        <div className="border-t mt-6 pt-6 flex justify-center items-center">
            <nav className="flex gap-4">
                <Link href="#" className="text-xs hover:underline">Terms of Service</Link>
                <Link href="#" className="text-xs hover:underline">Privacy Policy</Link>
                <Link href="#" className="text-xs hover:underline">Contact Us</Link>
            </nav>
        </div>
      </div>
    </footer>
  );
}
