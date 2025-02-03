import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { Briefcase, HomeIcon, MessagesSquareIcon, SearchIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <div className="flex items-center p-2 w-full mx-auto bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-800">
      {/* Logo */}
      <Image
        className="rounded-lg ml-2"
        src="https://links.papareact.com/b3z"
        alt="Networking Platform"
        width={40}
        height={40}
      />

      {/* Search Bar */}
      <div className="flex-1">
        <form className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 p-2 rounded-md flex-1 mx-2 max-w-96">
          <SearchIcon className="h-4 text-gray-600 dark:text-gray-300" />
          <Input
            type="text"
            placeholder="Search"
            className="bg-transparent flex-1 outline-none text-gray-900 dark:text-gray-100"
          />
        </form>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-4 px-6">
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
          <Button asChild variant="secondary">
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