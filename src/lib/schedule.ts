import { z } from "zod";

export const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be HH:MM in 24-hour format");

export const inactiveWindowSchema = z
  .object({
    start: timeStringSchema,
    end: timeStringSchema,
  })
  .refine((data) => data.start !== data.end, {
    message: "Start and end must be different",
  });

export function isWithinInactiveWindow(
  now: Date,
  start: string,
  end: string,
  timezone: string,
): boolean {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(now);
  const hour = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
  const currentMinutes = hour * 60 + minute;

  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }
  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

export function getNextDeliveryTime(
  now: Date,
  deliveryTime: string,
  timezone: string,
): Date {
  const [dh, dm] = deliveryTime.split(":").map(Number);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(now);
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)!.value, 10);
  const local = new Date(get("year"), get("month") - 1, get("day"), dh, dm, 0);

  if (local <= now) local.setDate(local.getDate() + 1);
  return local;
}
