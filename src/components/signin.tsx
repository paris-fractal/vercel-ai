'use client'
import { useMutation } from "@tanstack/react-query"
import { useActionState, type FormEvent } from "react"
import { useFormStatus } from "react-dom"
import { api } from "~/trpc/react"

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? "Signing in..." : "Sign In"}
        </button>
    )
}

export function SignIn() {
    const signInMutation = api.user.signIn.useMutation({
        onSuccess: async () => {
            window.location.href = "/chat"
        },
    })

    async function signIn(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        signInMutation.mutate({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        })
    }

    return (
        <div className="w-full max-w-md space-y-4">
            <form onSubmit={signIn} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Email
                        <input
                            name="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </label>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        Password
                        <input
                            name="password"
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </label>
                </div>

                {signInMutation.error && (
                    <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                        Credentials not accepted.
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    )
}