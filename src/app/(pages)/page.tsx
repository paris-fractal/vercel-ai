import { auth } from "~/server/auth";
import { SignIn } from "../../components/signin";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth()
    redirect("/chat")
}