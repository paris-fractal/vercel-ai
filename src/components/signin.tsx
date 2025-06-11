import { signIn } from "~/server/auth"
import { redirect } from "next/navigation"

export function SignIn() {
    return (
        <form
            action={async (formData) => {
                "use server"
                await signIn()
            }}
        >
            <label>
                Email
                <input name="email" type="email" required />
            </label>
            <label>
                Password
                <input name="password" type="password" required />
            </label>
            <button type="submit">Sign In</button>
        </form>
    )
}