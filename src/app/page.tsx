import PostFeed from '@/components/PostFeed';
import PostForm from '@/components/PostForm';
import UserInformation from '@/components/UserInformation';
import Vector from '@/components/Vector';
import Widget from '@/components/Widget';
import { SignedIn } from '@clerk/nextjs';
import { getAllPosts } from '@/firebase/models/post';
import { getAllComments } from '@/firebase/models/comment';
import UserStats from '@/components/UserStats';

export const revalidate = 0;

export default async function Home() {
  const posts = await getAllPosts();
  const comments = await getAllComments();

  return (
    <main>
      <div className="mx-auto max-w-2xl text-center space-y-6 px-6 lg:px-8 mt-6">
            <p
              role="alert"
              className="inline-block bg-red-100 dark:bg-red-900 px-4 py-2 rounded-md text-red-700 dark:text-red-300 font-medium text-md"
            >
              <span className="mr-1">⚠️</span>
              <strong>Demo Notice:</strong>{" "}
              <span className="font-light">
                This live demo is provided solely for testing and development
                purposes. Functionality may be limited, unstable, or subject to
                sudden service restrictions. Use at your own risk;
                production-grade reliability is not guaranteed.
              </span>
            </p>
            </div>

    <div className="grid grid-cols-8 sm:px-5 mt-10">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={posts} comments={comments} />
        <UserStats />
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
    </main>
  );
}
