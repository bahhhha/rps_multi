"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Press_Start_2P } from "next/font/google";
import bg_img from "public/gamesbg.jpeg";
const press_start = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

const Page = () => {
	const router = useRouter();

	const [rooms, setRooms] = useState([]);

	const getRooms = async () => {
		const responce = await axios.get(
			"http://localhost:4000/api/rooms"
		);
		setRooms(Object.keys(responce.data));
	};

	useEffect(() => {
		getRooms();
	}, []);

	if (!rooms.length) return <>loading...</>;

	if (rooms.length === 0) {
		return (
			<div className={press_start.className}>
				<div
					className="h-screen text-center"
					style={{
						backgroundImage: `url(${bg_img.src})`,
					}}
				>
					{" "}
					<p className="text-white">
						Peace. No fights are going on.
					</p>
				</div>
			</div>
		);
	} else {
		return (
			<div className={press_start.className}>
				<div
					className="h-screen text-center"
					style={{
						backgroundImage: `url(${bg_img.src})`,
					}}
				>
					<p className="md:py-24 py-12 text-white">
						Available games:
					</p>
					<div className="md:py-24 py-12 space-y-4">
						{rooms.map((room) => (
							<div
								className=""
								onClick={() => {
									localStorage.setItem(
										"playerName",
										"opponent"
									);
									router.replace(
										`/pages/${room}`
									);
								}}
							>
								<button className=" hover:text-red-700 md:w-[480px] w-[200px] bg-white bg-opacity-75">
									{room}
								</button>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
};

export default Page;
