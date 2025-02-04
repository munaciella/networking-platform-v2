import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Briefcase, HomeIcon, MessagesSquareIcon, SearchIcon, UsersIcon } from 'lucide-react';
//import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ThemeToggle from './ThemeToggle';
import { FaLinkedinIn } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto bg-transparent dark:bg-zinc-800 dark:shadow-zinc-800">
      {/* Logo */}
      <FaLinkedinIn 
      className='ml-2 h-6 w-6 xl:h-8 xl:w-8 lg:h-8 lg:w-8 md:h-8 md:w-8'
      />

      {/* Search Bar */}
      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-700 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600 dark:text-gray-300" />
          <Input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none text-zinc-900 dark:text-zinc-100"
          />
        </form>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-2 px-1 md:space-x-4 lg:space-x-6 xl:space-x-6 lg:px-4 xl:px-6">
        <Link href="/" className="icon">
          <HomeIcon className="h-5" />
          <p>Home</p>
        </Link>

        <Link href="" className="icon hidden md:flex">
          <UsersIcon className="h-5" />
          <p>Network</p>
        </Link>

        <Link href="" className="icon hidden md:flex">
          <Briefcase className="h-5" />
          <p>Jobs</p>
        </Link>

        <Link href="" className="icon">
          <MessagesSquareIcon className="h-5" />
          <p>Messaging</p>
        </Link>

        {/* Authenticated User */}
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* Sign In Button */}
        <SignedOut>
          <Button asChild variant="secondary" className='dark:bg-white dark:text-black'>
            <SignInButton />
          </Button>
        </SignedOut>
      </div>

      {/* Dark Mode Toggle */}
      <ThemeToggle />
    </div>
  );
};

export default Header;