import { z } from "nestjs-zod/z";
export declare const validationSchema: any;
export type Config = z.infer<typeof validationSchema>;
