"use server"

import { signOut } from "~/server/auth"

export async function doSignout() {
    await signOut()
}