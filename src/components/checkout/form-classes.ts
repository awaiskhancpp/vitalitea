/** Shared Tailwind for checkout form fields */
export const inputClass =
  "w-full rounded-full border border-[#D1C9BE] bg-white px-4 py-2.5 font-['Host_Grotesk'] text-sm text-[#3B3B3B] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#627E5C] focus:ring-2 focus:ring-[#627E5C]/20"

export const couponInputClass =
  "w-full rounded-full border border-[#E5D4CE] bg-white px-4 py-2.5 font-['Host_Grotesk'] text-sm text-[#3B3B3B] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-neutral-400 focus:border-[#627E5C] focus:ring-2 focus:ring-[#627E5C]/20"

export const selectClass = `${inputClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10 [background-image:url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%234a4a4a%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')]`

export const labelClass =
  "mb-1.5 block font-['Host_Grotesk'] text-sm font-semibold text-[#3B3B3B]"

export const sectionFormHeadingClass =
  "border-b border-[#C4A574]/40 pb-2 font-['Host_Grotesk'] text-base font-bold text-[#7A5F2A]"

export function fieldClass(base: string, hasError: boolean) {
  return hasError ? `${base} border-red-500 focus:border-red-500 focus:ring-red-200/50` : base
}
