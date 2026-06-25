import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, Sparkles, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Chatbot</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by OpenAI GPT-4
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              AI-Powered Conversations{" "}
              <span className="text-primary">Made Simple</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Experience the future of communication with our intelligent chatbot
              platform. Get instant answers, generate content, and boost your
              productivity with AI.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Start Free Trial
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything You Need
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Smart Conversations
                </h3>
                <p className="text-sm text-muted-foreground">
                  Natural, context-aware conversations with AI that understands
                  your needs and delivers accurate responses.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Lightning Fast
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time streaming responses with zero lag. Get your answers
                  as they're being generated.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Secure & Private
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with encrypted conversations. Your
                  data stays yours.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Chatbot SaaS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}