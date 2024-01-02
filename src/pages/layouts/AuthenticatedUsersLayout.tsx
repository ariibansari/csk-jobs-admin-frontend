import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'

const AuthenticatedUsersLayout = (props: React.PropsWithChildren) => {
    return (
        <section className="min-h-[100dvh]">
            <Navbar />
            <div className='py-[10dvh]'>
                {props.children}
            </div>
            <Footer />
        </section>
    )
}

export default AuthenticatedUsersLayout