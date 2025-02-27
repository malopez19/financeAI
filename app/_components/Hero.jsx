import React from "react";
import Image from "next/image";
import { ContainerScroll } from "../../components/ui/container-scroll-animation";
import imgDashboard from "../../public/dashboard.png";

function Hero() {
  return (
    <section className="bg-[#27445d] flex items-center flex-col">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-[#b2a5ff] dark:text-white mb-8">
                La forma mas inteligente de<br />
                <span className="text-4xl md:text-[6rem] text-neutral-50 text-opacity-100 font-bold mt-1 mb-24 leading-none">
                  Administrar tu dinero
                </span>
              </h1>
            </>
          }
        >
          <Image
            src={imgDashboard}
            alt="imagen dashboard"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </section>
  );
}

export default Hero;
