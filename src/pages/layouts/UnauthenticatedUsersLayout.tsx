import { ModeToggle } from '@/components/mode-toggle'
import React from 'react'

const UnauthenticatedUsersLayout = (props: React.PropsWithChildren) => {
    return (
        <section className="relative h-[100dvh]">
            <ModeToggle className="absolute right-5 top-5 z-1" />
            {props.children}
        </section>
    )
}

export default UnauthenticatedUsersLayout