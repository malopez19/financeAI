import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="min-h-screen bg-[#27445d]" role="region">
      <div className="sm:grid sm:min-h-screen sm:grid-cols-1">
        <main className="flex items-center justify-center px-8 py-8 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl mt-14">
            <div className="flex justify-center">
              <h1 className="mb-12 text-4xl font-bold text-white sm:text-3xl flex justify-center align-middle md:text-4xl">
                Registrate a Qoin 
              </h1>
            </div>
            <SignUp />
          </div>
        </main>
      </div>
    </section>
  );
}
