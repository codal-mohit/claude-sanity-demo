import { Button } from "@/app/ui/Button";
import { Card, CardContent, CardDescription, CardTitle } from "@/app/ui/Card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-6">
      <h1 className="text-secondary-900 text-3xl font-semibold dark:text-white">
        Meridian
      </h1>
      <Card>
        <CardTitle>Coming soon</CardTitle>
        <CardDescription>
          A multilingual editorial and commerce platform powered by Sanity.
        </CardDescription>
        <CardContent>
          <Button>Get started</Button>
        </CardContent>
      </Card>
    </main>
  );
}
