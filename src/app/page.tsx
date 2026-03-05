
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-2">
          <Zap className="w-4 h-4 text-primary" />
          <span>New: AI-Powered Summaries included</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Publish your thoughts <br /> with <span className="text-primary">BlogVista</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          The most powerful platform for writers. Secure, beautiful, and powered by the latest AI technology to help you reach your audience.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/feed">
            <Button size="lg" className="h-12 px-8 text-lg gap-2">
              Explore Feed <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
              Start Writing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card/50 py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-headline">Secure & Private</h3>
              <p className="text-muted-foreground leading-relaxed">
                Full control over your content. Keep your drafts private until you are ready to share with the world.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-headline">AI Summaries</h3>
              <p className="text-muted-foreground leading-relaxed">
                Automatically generate concise summaries for your posts to improve engagement and readability.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-headline">Social Features</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built-in like and comment system allows you to build a community around your writing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
