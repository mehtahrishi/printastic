
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

function ResetPasswordPageComponent() {
    return (
        <section className="py-8 md:py-16">
            <div className="container">
                <ResetPasswordForm />
            </div>
        </section>
    );
}

// Wrap with Suspense because it uses `useSearchParams`
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordPageComponent />
        </Suspense>
    )
}
