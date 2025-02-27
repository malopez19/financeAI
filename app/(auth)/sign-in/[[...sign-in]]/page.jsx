import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-[#27445d]">
      <div className="lg:grid lg:min-h-screen ">
        <section className="relative flex h-32 sm:hidden bg-[#27445d] lg:col-span-5 lg:h-full xl:col-span-6 justify-center items-center">
          
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 lg:hidden flex justify-center">
              <h1 className="my-10 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Bienvenido a Qoin 
              </h1>
            </div>

            <SignIn fallbackRedirectUrl={process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}/>
          </div>
        </main>
      </div>
    </section>
  );
}
