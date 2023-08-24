import Link from "next/link";
import { Press_Start_2P } from "next/font/google";
import bg_img from "public/choice.jpg";
const press_start = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

const JoinOrCreate = () => {
	return (
		<div className={press_start.className}>
			<div
				className="h-screen "
				style={{ backgroundImage: `url(${bg_img.src})` }}
			>
				<div className="text-white flex items-center h-screen justify-center space-x-4 md:space-x-24 md:text-2xl">
					<Link
						href="/pages/lobby"
						className="p-4 bg-red-500 hover:bg-red-950 rounded-md drop-shadow-xl"
					>
						Create game
					</Link>
					<Link
						href="/games"
						className="p-4 hover:bg-slate-900 bg-blue-500 rounded-md drop-shadow-xl"
					>
						Join game
					</Link>
				</div>
			</div>
		</div>
	);
};

export default JoinOrCreate;
