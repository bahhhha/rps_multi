"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import bg from "public/bg2.jpg";
import Head from "next/head";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
const press_start = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

const images = [
	{ img: "/sword.png" },
	{ img: "/paper.png" },
	{ img: "/rock.png" },
];

const PixelImage = ({ image }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.5 }}
		>
			<img
				src={image.img}
				className="md:w-[200px] w-[80px] move-around shadow-solid"
				alt=""
			></img>
		</motion.div>
	);
};

export default function Index() {
	const imagesToShow = images.map((image, i) => {
		return <PixelImage image={image} key={i} />;
	});
	return (
		<div className={press_start.className}>
			<div className="m-auto bg-[#050b1e]">
				<Head>
					<link
						rel="preconnect"
						href="https://fonts.googleapis.com"
					/>
					<link
						rel="preconnect"
						href="https://fonts.gstatic.com"
						crossorigin
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<main
					className="w-screen h-screen "
					style={{ backgroundImage: `url(${bg.src})` }}
				>
					<div className="pt-48 pb-32">
						<ol className="flex justify-center md:space-x-36 space-x-6">
							<AnimatePresence>
								{imagesToShow}
							</AnimatePresence>
						</ol>
						<div className="text-center md:pt-16 pt-8 move-around">
							<div className="text-2xl introtext move-around px-4 pb-12 md:py-0">
								Blade, Spells, & Rock
							</div>
							<div className="text-white pt-6 md:w-[720px] w-[300px] md:text-lg text-sm m-auto">
								Once upon in time, the
								forces of Darkness came
								to the villagers of
								Escapia. Here, the best
								warriors gather to save
								the world - once and for
								all.
							</div>
						</div>
					</div>
					<div>
						<div className="flex">
							<Link
								href="/pages/joinorcreate"
								className="m-auto px-5 py-3 rounded-sm introbutton"
							>
								Fight!
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
