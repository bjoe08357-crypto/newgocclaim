import React from 'react';
import { GradientButton } from '@/components/ui/GradientButton';

export function PrimaryButton(
  props: React.ComponentProps<typeof GradientButton>
) {
  return <GradientButton {...props} />;
}
