import { useEffect, useState } from 'react'
import { fetchShippingRegions } from '@/lib/checkout/api'
import type { ShippingRegionDto } from '@/lib/checkout/types'

export function useShippingRegions(): ShippingRegionDto[] {
  const [regions, setRegions] = useState<ShippingRegionDto[]>([])

  useEffect(() => {
    void (async () => {
      const r = await fetchShippingRegions()
      if (r.ok) setRegions(r.data.regions)
      else setRegions([])
    })()
  }, [])

  return regions
}
