import { Nav, NavLink } from '@/components/nav'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Nav>
        <NavLink href='/admin'>Dashboard</NavLink>
        <NavLink href='/admin/products'>Products</NavLink>
        <NavLink href='/admin/users'>Customers</NavLink>
        <NavLink href='/admin/orders'>Sales</NavLink>
        <NavLink href='/admin/webnews/newspages'>NewsPages</NavLink>
        {/* <div className='dropDown'>
          <a className='dropDownBtn'>
            Prisma<i className='fa fa-caret-down'></i>
          </a>
          <div className='dropDown-content'>
            <a href='/admin/webnews/update-section'>Update Section</a>
            <a href='/admin/webnews/delete-section'>Delete Section</a>
            <a href='/admin/prisma/list-pages-types'>ListPagesTypes</a>
          </div>
        </div> */}
        <NavLink href='/admin/youtube/playlists'>PlayLists</NavLink>
        <NavLink href='/admin/youtube/playlists-to-webnews'>PlToWebNews</NavLink>
        <NavLink href='/logging/log'>Log</NavLink>
        <NavLink href='/logging/clearlog'>ClearLog</NavLink>
      </Nav>
      <div>{children}</div>
    </>
  )
}
