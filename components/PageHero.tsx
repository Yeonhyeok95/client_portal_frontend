export default function PageHero({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="px-6 sm:px-10 mt-6">
      <div className="max-w-[1280px] mx-auto bg-navy rounded-[20px] py-16 sm:py-[70px] px-8 sm:px-20 text-center">
        <div className="text-sm font-bold tracking-[2.4px] text-blue-tint uppercase mb-4.5">
          {eyebrow}
        </div>
        <h1 className="mx-auto max-w-[700px] text-[34px] sm:text-[48px] font-bold leading-[1.2] text-white">
          {title}
        </h1>
      </div>
    </div>
  );
}
