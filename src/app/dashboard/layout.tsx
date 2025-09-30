'use client'

import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette'
import { DashboardLayout as DynamicDashboardLayout } from '@/components/layout/DashboardLayout'
import OnboardingTour from '@/components/onboarding/OnboardingTour'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { open, setOpen } = useCommandPalette()

  return (
    <DynamicDashboardLayout>
      {children}
      <CommandPalette open={open} onOpenChange={setOpen} />
      {/* <OnboardingTour isFirstTime={false} /> */}
    </DynamicDashboardLayout>
  )
}
