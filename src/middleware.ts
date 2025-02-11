import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/api',
  '/api/ip',
  '/api/posts',
  '/api/posts/:postId',
  '/api/posts/:postId/comments',
  '/api/posts/:postId/like',
  '/api/posts/:postId/unlike',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req) ) await auth.protect()
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};