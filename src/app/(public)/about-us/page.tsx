
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="bg-background bg-grid">
      <div className="container py-16 md:py-24">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
            The Art of Expression
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
            At Printastic, we believe that art is more than just decoration. It's a form of self-expression, a way to tell your story, and a means to transform a house into a home. Our mission is to connect talented independent artists with art lovers everywhere.
          </p>
        </section>

        {/* Mission/Vision Section */}
        <section className="mt-16 md:mt-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-foreground/80 mb-4 leading-relaxed">
              We are passionate about curating a diverse collection of high-quality, unique art prints that cater to every style and personality. We empower artists by providing them a platform to showcase their work and reach a global audience, ensuring they are fairly compensated for their creativity.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              For our customers, we strive to make the process of discovering and purchasing art an inspiring and seamless experience. Quality, affordability, and exceptional customer service are the pillars of our brand.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <Image
              src="https://picsum.photos/seed/about-mission/800/600"
              alt="An artist working in their studio"
              width={800}
              height={600}
              className="rounded-lg shadow-lg object-cover"
              data-ai-hint="artist studio"
            />
          </div>
        </section>

        {/* Team Section */}
        <section className="mt-16 md:mt-24">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.name} className="text-center">
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4 shadow-md"
                  data-ai-hint={member.imageHint}
                />
                <h3 className="font-semibold text-lg text-foreground">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 md:mt-24 text-center bg-card p-10 rounded-lg shadow-sm">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Find Your Perfect Print?</h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-6">
            Explore our curated collections and discover art that speaks to you.
          </p>
          <Button size="lg" asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

const teamMembers = [
  { name: "Jane Doe", role: "Founder & CEO", imageUrl: "https://i.pravatar.cc/200?u=jane", imageHint: "woman portrait" },
  { name: "John Smith", role: "Head of Curation", imageUrl: "https://i.pravatar.cc/200?u=john", imageHint: "man portrait" },
  { name: "Emily White", role: "Lead Designer", imageUrl: "https://i.pravatar.cc/200?u=emily", imageHint: "woman smiling" },
  { name: "Michael Black", role: "Marketing Director", imageUrl: "https://i.pravatar.cc/200?u=michael", imageHint: "man professional" },
];
