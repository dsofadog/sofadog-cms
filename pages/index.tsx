// pages/index.jsx
import Head from 'next/head';
import Link from "next/link";

const Home = () => (
	<div>
		<Head>
			<title>Next.js TailwindCSS</title>
			<link rel="icon" href="/favicon.ico" />
			<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
		</Head>

		<div className="container mx-auto">
			<h1 className="text-lg text-center m-4">TailwindUI/Next.js</h1>
			<div className=" mt-10 flex flex-row justify-center items-start flex-wrap min-w-full">
				<div className="rounded-full p-2 m-1 bg-gray-600 text-gray-100  w-24 h-24 flex items-center justify-center text-xl font-bold">Good </div>
				<div className="rounded-full p-2 m-1 bg-indigo-600 text-indigo-100  w-40 h-40 flex items-center justify-center text-xl font-bold">Analysis </div>
				<div className="rounded-full p-2 m-1 bg-pink-600 text-pink-100  w-32 h-32 flex items-center justify-center text-xl font-bold">Marketing </div>
				<Link href="/cms">
					<div className="cursor-pointer rounded-full p-2 m-1 bg-purple-600 text-purple-100  w-40 h-40 flex items-center justify-center text-xl font-bold">CMS </div>
				</Link>
				<div className="rounded-full p-2 m-1 bg-green-600 text-green-100  w-24 h-24 flex items-center justify-center text-xl font-bold">Growth </div>
				<div className="rounded-full p-2 m-1 bg-blue-600 text-blue-100  w-40 h-40 flex items-center justify-center text-xl font-bold">Reports </div>
				<div className="rounded-full p-2 m-1 bg-orange-600 text-orange-100  w-32 h-32 flex items-center justify-center text-xl font-bold">Metrics </div>
				<div className="rounded-full p-2 m-1 bg-yellow-600 text-yellow-100  w-40 h-40 flex items-center justify-center text-xl font-bold">Management </div>
				<div className="rounded-full p-2 m-1 bg-red-600 text-red-100  w-24 h-24 flex items-center justify-center text-xl font-bold">Fun </div>
				<div className="rounded-full p-2 m-1 bg-teal-600 text-teal-100  w-40 h-40 flex items-center justify-center text-xl font-bold">Profitable </div>
				<div className="rounded-full p-2 m-1 bg-gray-600 text-gray-100  w-32 h-32 flex items-center justify-center text-xl font-bold">Simple </div>
				<div className="rounded-full p-2 m-1 bg-indigo-600 text-indigo-100  w-40 h-40 flex items-center justify-center text-xl font-bold">Reliable </div>
			</div>
		</div>
	</div>
)

export default Home
