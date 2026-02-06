import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../utils/api";

export const Route = createFileRoute("/")({
	component: App,
	loader: async () => {
		const res = await api.users.$get();
		const data = await res.json();
		return data;
	},
});

function App() {
	const router = useRouter();
	const data = Route.useLoaderData();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	async function handleAddUser() {
		const res = await api.users.$post({
			json: {
				name,
				email,
			},
		});
		const data = await res.json();
		router.invalidate();
		setName("");
		setEmail("");
		return data;
	}

	return (
		<div>
			<div> Hello ini halaman dashboard </div>
			<div>
				{data.users.map((user) => {
					return <div key={user.id}>{user.name}</div>;
				})}
			</div>
			<div>
				<input
					placeholder="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<input
					placeholder="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button className="border" type="submit" onClick={handleAddUser}>
					Add user
				</button>
			</div>
		</div>
	);
}
