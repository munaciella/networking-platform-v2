import PostFeed from '@/components/PostFeed';
import PostForm from '@/components/PostForm';
import UserInformation from '@/components/UserInformation';
import Vector from '@/components/Vector';
import Widget from '@/components/Widget';
import { SignedIn } from '@clerk/nextjs';
import { getAllPosts } from '@/firebase/models/post';

export const revalidate = 0;

export default async function Home() {

  const posts = await getAllPosts();

  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={posts}/>
        <Vector />
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <SignedIn>
          <PostForm />
        </SignedIn>
        
        <PostFeed posts={posts} />
      </section>

      <section className="hidden xl:inline justify-center col-span-2">
        <Widget />
      </section>
    </div>
  );
}