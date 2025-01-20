import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 border">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
      <Link href="/dashboard/profile/">

        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
        </div>
        </Link>

      </div>
    </div>
  )
}

export default Navbar
