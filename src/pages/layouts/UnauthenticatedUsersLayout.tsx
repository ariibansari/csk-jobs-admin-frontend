import UnauthenticatedUsersNavbar from '@/components/navbar/UnauthenticatedUsersNavbar'
import React from 'react'

const UnauthenticatedUsersLayout = (props: React.PropsWithChildren) => {
    return (
        <section className="relative h-[100dvh]">
            <UnauthenticatedUsersNavbar />
            {props.children}
        </section>
    )
}

export default UnauthenticatedUsersLayout