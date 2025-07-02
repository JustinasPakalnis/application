import { json, type MetaFunction } from "@remix-run/node";
import { prisma } from "~/utils/database.server";
import redisClient from "~/utils/cache.server";

export const meta: MetaFunction = () => {
  return [{ title: "Great new app" }];
};

export async function loader() {
  const cachedUsers = await redisClient.get("users");

  if (cachedUsers) {
    console.log("Cache exists", JSON.parse(cachedUsers));
    return json({ users: JSON.parse(cachedUsers) });
  }

  console.log("Cache missing - fetching from DB");
  const users = await prisma.user.findMany();
  console.log("users", users);
  await redisClient.set("users", JSON.stringify(users), "EX", 3600);

  return json({ users });
}

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next? Never knows, You shall not pass!
          </p>
          <ul>
            <li>Yeah boy</li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
