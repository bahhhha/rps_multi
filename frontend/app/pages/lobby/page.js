"use client";
import React, { useState, useEffect, useRef } from "react";
import bg from "public/bg.jpg";
import { Press_Start_2P } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import useWebSocket from "react-use-websocket";
import { useRouter } from "next/navigation";

const images = [
	{ img: "/sword.png" },
	{ img: "/paper.png" },
	{ img: "/rock.png" },
];

const press_start = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

const Lobby = () => {
	const router = useRouter();

	const [text, setText] = useState("");
	const textToShow =
		"Great. You're here. To be honest, I didn't think you would come. Anyways... Let's find you a worthy opponent.";
	const delay = 75; // Delay between each letter rendering in milliseconds
	const currentIndexRef = useRef(0);

	let socket = new WebSocket("ws://localhost:4000");

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);

		if (data.event === "newGame") {
			localStorage.setItem("playerName", data.playerName);
			router.replace(`/pages/${data.roomID}`);
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setText(
				(prevText) =>
					prevText +
					textToShow[currentIndexRef.current++]
			);

			if (currentIndexRef.current + 1 === textToShow.length) {
				clearInterval(interval);
			}
		}, delay);

		return () => {
			clearInterval(interval);
		};
	}, []);
	const [username, setUsername] = useState("");

	if (!socket) return <>Loading...</>;

	const handleSubmit = (e) => {
		e.preventDefault();

		if (username.trim() !== "") {
			const playerName = e.target.username;
			const event = {
				event: "createGame",
				data: playerName.value,
			};
			socket.send(JSON.stringify(event));
			setUsername("");
		}
	};

	return (
		<div className={press_start.className}>
			<audio className="audio-element">
				<source src="/intro.mp3"></source>
			</audio>
			<main
				className="w-screen h-screen"
				style={{ backgroundImage: `url(${bg.src})` }}
			>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
				>
					<div className="text-white p-5 bg-[rgba(0,0,0,0.2)]">
						{text}
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
				>
					<div className="md:py-52 items-center py-12 px-8 md:px-0 m-auto">
						<div className="bg-[rgba(0,0,0,0.4)] border-2 border-[#4a7deb] rounded-md text-white min-h-[480px] m-auto md:w-[360px] p-8">
							<div className="flex justify-center py-4">
								{images.map((image) => {
									return (
										<img
											className="w-14 drop-shadow-sm"
											src={
												image.img
											}
										></img>
									);
								})}
							</div>
							<div className="text-center text-2xl lobbyenlist text-[#ffffff]">
								Enlist
							</div>
							<div className="mt-8">
								<form
									onSubmit={
										handleSubmit
									}
								>
									<label
										htmlFor="username"
										className="block text-white font-medium mb-2"
									>
										What's
										your name,
										warrior?
									</label>
									<input
										type="text"
										id="username"
										name="username"
										value={
											username
										}
										onChange={(
											e
										) =>
											setUsername(
												e
													.target
													.value
											)
										}
										className="border border-gray-300 text-black py-2 px-3 rounded-md w-full"
									/>
									<div className="flex justify-center">
										<button
											type="submit"
											className="mt-8 bg-[#4a7deb] lobbybutton hover:bg-white hover:text-[#4a7deb] text-white py-2 px-4 rounded-md"
										>
											Join
											battle
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default Lobby;
