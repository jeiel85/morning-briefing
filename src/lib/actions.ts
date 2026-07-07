"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { timeStringSchema } from "@/lib/schedule";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const preferencesSchema = z.object({
  timezone: z.string().min(1),
  inactiveWindowStart: timeStringSchema,
  inactiveWindowEnd: timeStringSchema,
  briefingDeliveryTime: timeStringSchema,
  emailEnabled: z.coerce.boolean(),
  pushEnabled: z.coerce.boolean(),
  urgentAlertsEnabled: z.coerce.boolean(),
  categories: z.array(z.string()).default([]),
  interestKeywords: z.string().transform((s) => s.split(",").map((k) => k.trim()).filter(Boolean)),
  blockedKeywords: z.string().transform((s) => s.split(",").map((k) => k.trim()).filter(Boolean)),
});

export async function savePreferences(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const raw = Object.fromEntries(formData);
  const parsed = preferencesSchema.parse(raw);

  await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    update: parsed,
    create: { userId: session.user.id, ...parsed },
  });

  revalidatePath("/app/settings");
}

export async function getPreferences() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });
}
