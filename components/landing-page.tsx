import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

export function LandingPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[100dvh]">
      <div className="flex flex-col items-center justify-center px-4 md:px-6 py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-orange-900 dark:bg-orange-900 dark:text-orange-100">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Connect with New People
          </h1>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl">
            Start chatting with strangers from around the world. Make new
            friends and have fun!
          </p>
          <Button
            className="bg-primary w-full max-w-[240px] text-white hover:bg- focus:ring-"
            color="orange"
            variant="primary">
            Start Chatting
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <img
          alt="Image"
          className="rounded-full"
          src="/placeholder.svg"
          style={{
            width: "350px",
            height: "350px",
            objectFit: "cover",
          }}
        />
      </div>
      <footer className="w-full border-t border-gray-200 pt-6 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        <div className="container flex justify-center">
          <p className="text-center">© 2024 Holameet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
