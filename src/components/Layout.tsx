import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, useState } from "react";

export const PageLayout = observer((props: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);


  const user = useUser();

  return (
    !user.isSignedIn ?
      <div className='w-screen h-screen flex justify-center align-center'>
        {/* <div className="space-y-6 align-center"> */}
        <SignInButton>
          <button type="submit" className="w-fit h-fit self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
        </SignInButton>
        {/* </div> */}
      </div>
      : <>
        <button onClick={() => { setIsOpen(!isOpen) }} data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
          <span className="sr-only">Open sidebar</span>
          <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
          </svg>
        </button>

        <aside onClick={(e) => { e.stopPropagation() }} id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isOpen ? '' : '-translate-x-full sm:translate-x-0'}`} aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <Link onClick={()=>{setIsOpen(false)}} href="/" className="flex items-center pl-2.5 mb-5">
              <Image width={28} height={28} src="/HeaderLogo2.png" className="h-6 mr-3 sm:h-7 rounded-full" alt="VerdantHome logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">VerdantHome</span>
            </Link>
            <ul className="space-y-2">
              {/* <li>
                <Link onClick={()=>{setIsOpen(false)}} href="/test2" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" className='flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">test2</span>
                </Link>
              </li> */}
              {/* <li>
                <Link onClick={()=>{setIsOpen(false)}} href="/upload" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg fill="none" stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">Documents</span>
                </Link>
              </li> */}
              <SignOutButton>
                <Link href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">Sign out</span>
                </Link>
              </SignOutButton>
            </ul>
          </div>
        </aside>

        {isOpen ? <div onClick={() => setIsOpen(false)} className="fixed top-0 right-0 z-39 h-screen w-screen bg-slate-800 opacity-20">
          <div className="p-4 sm:ml-64 h-screen">
            {props.children}
          </div>
        </div> :
          <div className="p-4 sm:ml-64 h-screen">
            {props.children}
          </div>}
      </>
  )
})