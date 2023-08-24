"use client";
import { useEffect } from "react";
import { Press_Start_2P } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import bg_img from "public/game_bg.jpg";
const press_start = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

const choices = [
	{
		img: "/sword.png",
		name: "blade",
	},
	{
		img: "/paper.png",
		name: "spells",
	},
	{
		img: "/rock.png",
		name: "rock",
	},
];

const Choice = ({ img, name, roomID, socket }) => {
	const handleClick = () => {
		let choicePlayer = "";
		if (localStorage.getItem("playerName") === "opponent") {
			choicePlayer = "choice2";
		} else {
			choicePlayer = "choice1";
		}

		const event = {
			event: choicePlayer,
			data: JSON.stringify({
				roomID: roomID,
				choice: name,
			}),
		};
		socket.send(JSON.stringify(event));
	};

	return (
		<button
			onClick={handleClick}
			className="p-4 bg-[#3a0202] border-2 choice rounded-xl duration-150 hover:border-[#f5c62c] hover:bg-[#000000] bg-opacity-50 "
		>
			<img src={img} className="w-[70px]"></img>
		</button>
	);
};

const Game = ({ params }) => {
	let socket = new WebSocket("ws://localhost:4000");

	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);

		if (message.event === "result") {
			const winner = message.data.winner;
			console.log("Result:", winner);
		}
	};

	socket.onopen = (event) => {
		console.log("hello");
		const res = {
			event: "joinGame",
			data: JSON.stringify({
				roomID: params.game,
				name: localStorage.getItem("name"),
			}),
		};
		socket.send(JSON.stringify(res));
	};

	return (
		<div className={press_start.className}>
			<div
				className="w-full h-screen text-center"
				style={{ backgroundImage: `url(${bg_img.src})` }}
			>
				<div className="text-2xl p-4 introtext move-around py-12">
					Blade, Spells, & Rock
				</div>
				<div className="flex md:flex-row flex-col space-y-4 md:space-y-0 justify-around py-16">
					<div>
						<div className="text-white md:text-justify text-center m-auto md:text-xl ">
							Rules of the game:
							<ol className="mt-3 md:mt-8">
								<li>
									• Blade beats
									Spells.
								</li>
								<li>
									• Spells beat
									Rock.
								</li>
								<li>
									• Rock beats
									Blade.
								</li>
							</ol>
						</div>
					</div>

					<div className="p-4">
						<img
							src="/game.gif"
							className="w-full m-auto border-2 gamecomponent rounded-md border-[#f5c62c] shadow-xl"
						></img>
						<div className="flex justify-center py-12 md:space-x-20 space-x-4">
							{choices.map((choice, i) => {
								return (
									<Choice
										img={
											choice.img
										}
										name={
											choice.name
										}
										roomId={
											params.game
										}
										socket={
											socket
										}
									/>
								);
							})}
						</div>
					</div>
					<div>
						<div className="text-white"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Game;
