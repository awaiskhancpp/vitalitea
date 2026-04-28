export default function AuthSplitLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative my-8 flex justify-center">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-[#E5E5E5]" />
      </div>
      <span className="relative bg-white px-3 font-['Martel_Sans'] text-[0.8125rem] text-[#737373]">
        {children}
      </span>
    </div>
  )
}
