import React, { useState, useEffect } from 'react';
import Link from "next/link";

const Demo = () => {

    const [openTagDropdown, setOpenTagDropdown] = useState(false);
    const toggleTagDropdown = () => { setOpenTagDropdown(!openTagDropdown) };

    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
    const toggleCateDropdown = () => { setOpenCategoryDropdown(!openCategoryDropdown) };

    return (
        <div className="w-full h-full bg-black">
            <nav className="bg-gray-800 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="-ml-2 mr-2 flex items-center md:hidden">

                                <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out" aria-label="Main menu" aria-expanded="false">

                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-shrink-0 flex items-center space-x-2">
                                <Link href="/">
                                    <img className="h-8 w-auto cursor-pointer" src="/color-logo.png" alt="So.Fa.Dog" />
                                </Link>
                                <Link href="/">
                                    <img className="h-4 w-auto cursor-pointer" src="/logo-title-white.png" alt="So.Fa.Dog" />
                                </Link>

                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="rounded-md shadow-sm">
                                    <button type="button" className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-400 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-600 active:bg-indigo-600 transition duration-150 ease-in-out">

                                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                                        </svg>
                                        <span>New Item</span>
                                    </button>
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
            <div className="max-w-7xl mx-auto">
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-16 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-2/5 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-16">
                                <div className="w-full flex items-center px-4 bg-white rounded-lg">
                                    <div className="flex items-center w-full">
                                        <form className="sm:flex w-full" aria-labelledby="newsletter-headline">
                                            <input aria-label="search box" type="text" required className="appearance-none w-full px-3 py-3 border border-gray-300 text-base leading-6 rounded-md text-gray-900 bg-gray-100 placeholder-gray-500 focus:outline-none focus:shadow-outline focus:border-blue-300 transition duration-150 ease-in-out sm:max-w-xs" placeholder="Search by title" />
                                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                                <button className="w-full flex items-center justify-center px-12 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                                                    Search
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-11/12 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-xl">

                                <div className="relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8 border-white">
                                    <div className="py-2">
                                        <div className="w-full flex justify-end">
                                            <button className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer">Save Data</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-full">
                                            <label htmlFor="about" className="block text-sm font-medium leading-5 text-gray-700">
                                                Title
                                            </label>
                                            <div className="mt-1 rounded-md shadow-sm">
                                                <textarea id="about" rows={2} className="form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder="Enter Title"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full mb-4">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>English</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Estonian</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4 space-y-1" role="group" aria-labelledby="teams-headline">
                                                    {/* <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div> */}
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                    </div>
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                    </div>
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>News Credits</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Visual Credits</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4 space-y-1" role="group" aria-labelledby="teams-headline">
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add News Credit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute mb-4 mr-4 bottom-0 inset-x-0 flex">
                                        <div className="w-full ml-4 space-x-2 flex justify-start">
                                            <div className="relative inline-block text-left">
                                                <div>
                                                    <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                            Category
                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </div>
                                                {openCategoryDropdown && (
                                                    <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-20">
                                                        <div className="rounded-md bg-white shadow-xs">
                                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    LIFE & POLITICS
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    FASHION & ART
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    CELEBRITIES
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    ENTERTAINMENT
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    NATURE
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    SCIENCE
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    BUSINESS & TECH
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    SELF-IMPROVEMENT
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full space-x-2 flex justify-end">
                                            <div className="relative inline-block text-left">
                                                <div>
                                                    <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                                        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                            Tags
                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </div>
                                                {openTagDropdown && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                                                        <div className="rounded-md bg-white shadow-xs">
                                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    Local Estonian Content
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    NSFW
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    NSFL
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/5 relative z-10 bg-gray-100 border-l border-gray-200 p-2 rounded-lg rounded-l-none">
                                    <div className="h-full w-full flex items-start">
                                        <div className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
                                                        Upload a file
                                                    </button>
                                                    or drag and drop
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    MP4, MOV, WMV up to 500MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-11/12 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-xl">
                                <div className="w-full md:w-1/5 relative z-10">
                                    <div className="absolute inset-x-0 top-0 transform translate-y-px">
                                        <div className="flex justify-center transform translate-y-1/2">
                                            <span className="bg-green-400 inline-flex w-full h-10 flex items-center justify-center text-center px-4 py-1 text-xs leading-5 font-semibold tracking-wider uppercase text-white">
                                                Pushed To Feed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-full w-full bg-green-400 rounded-lg rounded-r-none flex items-start">
                                        <img className="h-auto w-full shadow-2xl rounded-lg rounded-r-none rounded-b-none"
                                            src="https://cdn.so.fa.dog/thumbnails-int/76c3923c-0f5f-11eb-8a82-01bf9fcdf51b.jpg_43.jpg" alt="bag" />
                                    </div>

                                </div>
                                <div className="relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-r-lg border-r-8 border-green-400">
                                    <div className="mb-4">
                                        <div className="w-full flex justify-end">
                                            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer">Remove Feed</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-base text-gray-800 font-medium mr-auto">Illustrations and Animations Designed for Hip Hop Digital artist Ali Graham directs Anderson Paak's new video clip 'Jewelz' in collaboration with Vans jewelz.m4a 73.2 KB Download *pls use the 'digital art' templateSource: IG: lil_ye Visuals: YT:Anderson Paak</h2>
                                    </div>
                                    <div className="w-full mb-4">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>English</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Estonian</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>News Credits</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Visual Credits</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>Al Jazeera</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>Oxfam America</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>IG: iamcardib</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute mb-4 mr-4 bottom-0 inset-x-0">
                                        <div className="w-full space-x-2 flex justify-end">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                Local Estonian Content
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                NSFW
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                NSFL
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-11/12 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-xl">

                                <div className="relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8 border-red-400">
                                    <div className="mb-4">
                                        <div className="w-full flex justify-end">
                                            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs cursor-pointer">Remove Feed</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <h2 className="text-base text-gray-800 font-medium mr-auto">Illustrations and Animations Designed for Hip Hop Digital artist Ali Graham directs Anderson Paak's new video clip 'Jewelz' in collaboration with Vans jewelz.m4a 73.2 KB Download *pls use the 'digital art' templateSource: IG: lil_ye Visuals: YT:Anderson Paak</h2>
                                    </div>
                                    <div className="w-full mb-4">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>English</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Estonian</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>News Credits</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Visual Credits</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4" role="group" aria-labelledby="teams-headline">
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>Al Jazeera</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>Oxfam America</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>IG: iamcardib</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute mb-4 mr-4 bottom-0 inset-x-0">
                                        <div className="w-full space-x-2 flex justify-end">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                Local Estonian Content
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                NSFW
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                NSFL
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/5 relative z-10 bg-red-400 rounded-lg rounded-l-none">
                                    <div className="absolute inset-x-0 top-0 transform translate-y-px">
                                        <div className="flex justify-center transform translate-y-1/2">
                                            <span className="bg-red-400 inline-flex w-full h-10 flex items-center justify-center text-center px-4 py-1 text-xs leading-5 font-semibold tracking-wider uppercase text-white">
                                                Pushed To Feed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-full w-full flex items-start">
                                        <img className="h-auto w-full shadow-2xl rounded-lg rounded-l-none rounded-b-none"
                                            src="https://cdn.so.fa.dog/thumbnails-int/76c3923c-0f5f-11eb-8a82-01bf9fcdf51b.jpg_43.jpg" alt="bag" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mx-auto">
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-11/12 mx-auto flex-none float-left">
                            <div className="md:flex shadow-lg mx-6 md:mx-auto w-full h-xl">

                                <div className="relative w-full h-full md:w-4/5 px-4 py-2 bg-white rounded-l-lg border-l-8 border-red-400">
                                    <div className="py-2">
                                        <div className="w-full flex justify-end">
                                            <button className="px-2 py-1 bg-green-500 text-white rounded text-xs cursor-pointer">Save Data</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <div className="w-full">
                                            <label htmlFor="about" className="block text-sm font-medium leading-5 text-gray-700">
                                                Title
                                            </label>
                                            <div className="mt-1 rounded-md shadow-sm">
                                                <textarea id="about" rows={2} className="form-textarea block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5" value="World Food Day: Countries Must Act, and Invest, to Contain Growing Famine Amid Pandemic"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full mb-4">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>English</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Estonian</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4 space-y-1" role="group" aria-labelledby="teams-headline">
                                                    {/* <div className="group flex items-center px-3 text-xs leading-5 font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition ease-in-out duration-150">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <div className="w-full mt-1 relative rounded-md shadow-sm">
                                                            <input id="text" className="form-input block w-full text-xs sm:leading-3" placeholder="Enter sentence" />
                                                        </div>
                                                    </div> */}
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>12K people are at risk of dying every day from hunger linked to the virusOver 2B people lack access to safe, nutritious and sufficient food, 7M died of hunger this year World Food Programme says US$6.8B needed in six months to avert famine amid pandemic</span>
                                                        </div>
                                                    </div>
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                    </div>
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add Sentence</button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full">
                                        <div className="p-4 shadow rounded border border-gray-300">
                                            <div className="block">
                                                <div className="border-b border-gray-200">
                                                    <nav className="flex -mb-px">
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700" aria-current="page">
                                                            <span>News Credits</span>
                                                        </a>
                                                        <a href="#" className="ml-8 group inline-flex items-center py-2 px-1 border-b-2 border-transparent font-medium text-sm leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300">
                                                            <span>Visual Credits</span>
                                                        </a>
                                                    </nav>
                                                </div>
                                                <div className="mt-4 space-y-1" role="group" aria-labelledby="teams-headline">
                                                    <div className="flex items-center space-x-3 pl-3">
                                                        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                                                        <div className="truncate hover:text-gray-600 text-xs">
                                                            <span>Al Jazeera</span>
                                                        </div>
                                                    </div>
                                                    <div className="group px-3 flex items-center leading-5 font-medium">
                                                        <span className="w-2.5 h-2.5 mr-4 bg-indigo-500 rounded-full"></span>
                                                        <button className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">+ Add News Credit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute mb-4 mr-4 bottom-0 inset-x-0 flex">
                                        <div className="w-full ml-4 space-x-2 flex justify-start">
                                            <div className="relative inline-block text-left">
                                                <div>
                                                    <span onClick={toggleCateDropdown} className="rounded-md shadow-sm">
                                                        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                            Category
                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </div>
                                                {openCategoryDropdown && (
                                                    <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg z-20">
                                                        <div className="rounded-md bg-white shadow-xs">
                                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    LIFE & POLITICS
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    FASHION & ART
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    CELEBRITIES
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    ENTERTAINMENT
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    NATURE
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    SCIENCE
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    BUSINESS & TECH
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    SELF-IMPROVEMENT
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                CELEBRITIES
                                                <button type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>
                                        <div className="w-full space-x-2 flex justify-end">
                                            <div className="relative inline-block text-left">
                                                <div>
                                                    <span onClick={toggleTagDropdown} className="rounded-md shadow-sm">
                                                        <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-2 py-0.5 bg-white text-xs leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150" id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                            Tags
                                                        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </div>
                                                {openTagDropdown && (
                                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg">
                                                        <div className="rounded-md bg-white shadow-xs">
                                                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    Local Estonian Content
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    NSFW
                                                                </a>
                                                                <a href="#" className="block px-4 py-1 text-xs leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900" role="menuitem">
                                                                    NSFL
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                Local Estonian Content
                                                <button type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                NSFW
                                                <button type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 bg-blue-100 text-blue-800">
                                                NSFL
                                                <button type="button" className="flex-shrink-0 ml-1.5 inline-flex text-indigo-500 focus:outline-none focus:text-indigo-700" aria-label="Remove small badge">
                                                    <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
                                                    </svg>
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/5 relative z-10 bg-gray-100 border-l border-gray-200 p-2 rounded-lg rounded-l-none">
                                    <div className="h-full w-full flex items-start">
                                        <div className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                            <div className="text-center">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
                                                        Upload a file
                                                    </button>
                                                    or drag and drop
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    MP4, MOV, WMV up to 500MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex flex-no-wrap justify-center">
                        <div className="w-1/12 mx-auto flex-none float-left">
                            <div className="bg-purple-700 p-1 h-32 w-1 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Demo