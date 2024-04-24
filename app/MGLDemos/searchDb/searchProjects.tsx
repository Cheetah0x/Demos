//this is going to be a seaarch function for all the attestations that we add to the db

//do a little bit of research then send it

//end game would be to pick between querying eas and our own db

//use mix of server adn client side rendering

'use client';

import { FaSearch } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const SearchProjects = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [ filter, setFilter ] = useState("projectName");

    const handleSearch = (searchTerm: string) => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("query", searchTerm);
            params.set("filter", filter);
        } else {
            params.delete("query");
            params.delete("filter");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className='flex items-center space-x-4'>
                <div className="relative flex-grow">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <input
                        className="peer block w-full rounded-md border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                        placeholder="Search projects"
                        defaultValue={searchParams.get("query")?.toString() || ""}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -traanslate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                </div>
    
                <div className="flex-initial">
                    <label htmlFor="shape" className="block text-sm font-medium leading-6 text-gray-900">Filter</label>
                    <div className="mt-2">
                        <select
                        id="filter"
                        name="shape"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                        <option value="projectName">Project Name</option>
                        <option value="ethAddress">Eth Address</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    )
};

export default SearchProjects;
