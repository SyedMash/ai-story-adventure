import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { ArrowRight, BookOpen, Sparkles, Users } from "lucide-react";
import Bounded from "~/components/Bounded";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/auth/sign-in");

  return (
    <Bounded className="min-h-screen bg-transparent">
      {/* Navigation */}
      <header className="w-full border-b backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              AI Story Adventure
            </span>
          </div>
          <Link href={"/create"}>
            <Button className="cursor-pointer" variant={"outline"}>
              Start Creating <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-32 pb-20">
        <div className="container mx-auto text-center">
          <h1 className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Craft Your Next Adventure
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-gray-600">
            Welcome back, {session.user.name}! Dive into AI-powered storytelling
            and create immersive adventures that captivate your audience.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href={"/stories"}>
              <Button className="cursor-pointer">
                Your Stories <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={"/create"}>
              <Button variant="outline" className="cursor-pointer">
                Start New Adventure
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-3xl font-bold">
            Create Amazing Stories
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
              <p className="text-gray-600">
                Generate unique storylines and characters with advanced AI
                assistance.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Immersive</h3>
              <p className="text-gray-600">
                Create rich, interactive narratives that engage your readers.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Collaborative</h3>
              <p className="text-gray-600">
                Share and co-create stories with friends or the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Begin Your Adventure?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Join thousands of storytellers creating amazing adventures with AI.
          </p>
          <Link href={"/create"}>
            <Button className="cursor-pointer">
              Start Creating for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} AI Story Adventure. All rights
            reserved.
          </p>
        </div>
      </footer>
    </Bounded>
  );
}
