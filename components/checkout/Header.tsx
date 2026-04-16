import Image from "next/image";

export function Header() {
  return (
    <div style={{ background: "#FFFFFF" }} className="px-0">
      <div className="mx-auto max-w-2xl lg:max-w-[74rem] py-4 pb-4 md:py-5 md:pb-4 px-4 sm:px-0 flex justify-center">
        <Image
          src="/images/checkout-logo.png"
          alt="Dominó FC"
          width={150}
          height={47}
          className="max-w-[130px] md:max-w-[150px] object-contain"
          priority
        />
      </div>
    </div>
  );
}
