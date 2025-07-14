import { type MetaFunction, json, redirect } from "@remix-run/node";
import { prisma } from "~/utils/database.server";
import { useLoaderData, Form, useActionData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Great new app" }];
};

export const loader = async () => {
  const users = await prisma.user.findMany();
  return { users };
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const location = formData.get("location");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    (location && typeof location !== "string")
  ) {
    return json({ error: "Invalid form data" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return json({ error: "User already exists" }, { status: 400 });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        location: location || null,
      },
    });
    console.log("newUser", newUser);
    return redirect("/");
  } catch (error) {
    console.log("create user error", error);
    return json({ error: "Failed to create user" }, { status: 500 });
  }
};

export default function Index() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to DevOps Learning
          </h1>
          <p className="text-xl text-gray-300">
            Exploring the world of development and operations
          </p>
        </header>

        {/* User Creation Form */}
        <div className="max-w-md mx-auto mb-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-4 text-center">
            Create New User
          </h2>
          <Form
            method="post"
            className="space-x-4 flex justify-center items-end content-center "
          >
            {actionData?.error && (
              <div className="text-red-400 text-center">{actionData.error}</div>
            )}
            <div>
              <label htmlFor="email" className="block text-white mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-white mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-white mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                className="w-full px-3 py-2 rounded bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full  py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded transition"
            >
              Create User
            </button>
          </Form>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-cyan-400 mb-2">🚀</div>
            <h3 className="text-white font-semibold mb-2">Active Users</h3>
            <p className="text-2xl font-bold text-cyan-400">
              {users?.length || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-purple-400 mb-2">⚡</div>
            <h3 className="text-white font-semibold mb-2">Cache Status</h3>
            <p className="text-2xl font-bold text-purple-400">
              {users ? "🟢 Active" : "🔴 Inactive"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-3xl font-bold text-pink-400 mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-2">Database</h3>
            <p className="text-2xl font-bold text-pink-400">
              {users?.length || 0} Records
            </p>
          </div>
        </div>

        {/* User List */}
        {users && users.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Registered Users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user, index) => (
                <div
                  key={user.email || index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {user.email || `User ${index + 1}`}
                      </h3>
                      <p className="text-gray-300 text-sm">
                        {user.email || `user${index + 1}@example.com`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Elements */}
        <div className="fixed top-10 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="fixed top-20 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="fixed bottom-20 left-20 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}
