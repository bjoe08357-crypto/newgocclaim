import React from 'react';
import { Button } from '@/components/ui/Button';

export function SecondaryButton(
  props: React.ComponentProps<typeof Button>
) {
  return <Button variant="outline" {...props} />;
}
