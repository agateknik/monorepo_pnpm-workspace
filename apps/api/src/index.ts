import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./utils/prisma.js";
import { createUserSchema } from "./utils/schema.js";

const app = new Hono()
	.use(cors())
	.get("/users", async (c) => {
		const users = await prisma.user.findMany();
		return c.json({ users });
	})
	.post("/users", zValidator("json", createUserSchema), async (c) => {
		const body = c.req.valid("json");

		const newUser = await prisma.user.create({
			data: {
				name: body.name,
				email: body.email,
			},
		});
		return c.json({ data: newUser }, 201);
	});

//export API specification
export type AppType = typeof app;

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
