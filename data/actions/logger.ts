'use server';

import type { SelectItem } from '@/components/ui/select/Select';
import { slow } from '@/utils/slow';

export async function logUserSelectedConference(items: SelectItem[]) {
  // Simulate logging action
  await slow(500);
  console.log('User selected conference:', items);
}
