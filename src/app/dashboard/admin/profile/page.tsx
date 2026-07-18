import Profile from '@/components/DashboardComponents/Shared/Profile'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import React from 'react'

const Profilepage = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    const user = session?.user


    const baseurl = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${baseurl}/api/own/usercollaction?email=${user?.email}`)

    const userData = await res.json()
    return (
        <div>
            <Profile userData={userData} />
        </div>
    )
}

export default Profilepage