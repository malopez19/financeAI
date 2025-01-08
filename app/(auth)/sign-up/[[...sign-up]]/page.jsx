import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-blue-950">
      <div className="sm:grid sm:min-h-screen sm:grid-cols-1">
        <main className="flex items-center justify-center px-8 py-8 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <h1 className="mt-12 text-2xl font-bold text-white sm:text-3xl flex justify-center md:text-4xl">
                Bienvenido a FinappIA
              </h1>
            </div>
            <SignUp />
          </div>
        </main>
      </div>
    </section>
  );
}
