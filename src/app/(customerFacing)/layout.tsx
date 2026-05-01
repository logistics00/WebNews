import { Nav, NavLink } from "@/components/nav"

export const dynamic = "force-dynamic"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/my-orders">My Orders</NavLink>
        <NavLink href="/logging/log">Log</NavLink>
        <NavLink href="/logging/clearlog">ClearLog</NavLink>
      </Nav>
      <div>{children}</div>
    </>
  )
}
