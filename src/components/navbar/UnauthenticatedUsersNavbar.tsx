import { ModeToggle } from '@/components/mode-toggle'
import { NavLink } from 'react-router-dom'
import CustomNavLink from '../ui/customNavLink'
import Logo from '../ui/logo'


const UnauthenticatedUsersNavbar = () => {

  return (
    <nav className='border border-transparent border-b-input'>
      <div className='flex justify-between items-center py-3 container'>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <div className='flex items-center gap-7'>
          <div className='flex gap-5'>
            <CustomNavLink to='/login' label='Login' />
            <CustomNavLink to='/sign-up' label='Signup' />
          </div>

          <div className='flex gap-3 item-center'>
            <ModeToggle />
          </div>

        </div>
      </div>
    </nav >
  )
}

export default UnauthenticatedUsersNavbar