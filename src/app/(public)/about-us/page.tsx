
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Palette, Heart, Award, Users } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      <div className="container py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-primary tracking-tight mb-6">
            The Art of Expression
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-foreground/70 leading-relaxed">
            At Honesty Print House, we believe that art is more than just decoration. It's a form of self-expression,
            a way to tell your story, and a means to transform a house into a home. Our mission is to connect
            talented independent artists with art lovers everywhere.
          </p>
        </section>

        {/* Mission Section with Image */}
        <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
            <Image
              src="https://picsum.photos/seed/about-mission/800/600"
              alt="An artist working in their studio"
              width={800}
              height={600}
              className="rounded-2xl shadow-2xl object-cover relative z-10"
              data-ai-hint="artist studio"
            />
          </div>
          <div>
            <div className="inline-block p-2 bg-accent/10 rounded-lg mb-4">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-foreground/70 mb-6 leading-relaxed text-lg">
              We are passionate about curating a diverse collection of high-quality, unique art prints that
              cater to every style and personality. We empower artists by providing them a platform to showcase
              their work and reach a global audience, ensuring they are fairly compensated for their creativity.
            </p>
            <p className="text-foreground/70 leading-relaxed text-lg">
              For our customers, we strive to make the process of discovering and purchasing art an inspiring
              and seamless experience. Quality, affordability, and exceptional customer service are the pillars
              of our brand.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all duration-300">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-3">Passion for Art</h3>
              <p className="text-foreground/70">
                We celebrate creativity and believe in the transformative power of art in everyday life.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent hover:shadow-lg transition-all duration-300">
              <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-3">Quality First</h3>
              <p className="text-foreground/70">
                Every print is crafted with premium materials to ensure vibrant colors and lasting durability.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent hover:shadow-lg transition-all duration-300">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl text-foreground mb-3">Artist Empowerment</h3>
              <p className="text-foreground/70">
                We provide a platform for artists to thrive, ensuring fair compensation and global reach.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 p-12 md:p-16 rounded-3xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Find Your Perfect Print?</h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-lg">
            Explore our curated collections and discover art that speaks to you.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}

