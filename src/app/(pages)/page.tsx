import { auth } from "~/server/auth";
import { SignIn } from "../../components/signin";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth()

    console.log("user session", session)
    if (!session?.user) {
        return (
            <div className="flex flex-col h-full w-full justify-center items-center">
                <h1 className="text-2xl font-bold">Login</h1>
                <SignIn />
            </div>
        )
    }

    redirect("/chat")
}