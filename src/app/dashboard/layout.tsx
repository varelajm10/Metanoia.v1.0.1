'use client'

import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette'
import OnboardingTour from '@/components/onboarding/OnboardingTour'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { open, setOpen } = useCommandPalette()

  return (
    <>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
      {/* <OnboardingTour isFirstTime={false} /> */}
    </>
  )
}
