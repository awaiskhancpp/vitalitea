export function InputError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={`err-${id}`} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  )
}
