//this is going to be a seaarch function for all the attestations that we add to the db

//do a little bit of research then send it

//end game would be to pick between querying eas and our own db

//use mix of server adn client side rendering

'use client';

import { FaSearch } from "react-icons/fa";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const SearchProjects = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = (searchTerm: string) => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("query", searchTerm);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-1/2 rounded-md border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder="Search projects"
                defaultValue={searchParams.get("query")?.toString() || ""}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 h-[18px] w-[18px] -traanslate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>

    )
};

export default SearchProjects;
