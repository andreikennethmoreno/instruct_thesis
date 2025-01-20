import React from 'react'

const ProfileDetailsPage = () => {
  return (
    <>
        <div className="flex w-full">
  <div className="card bg-base-100 my-4 ml-3 border rounded-box grid  w-1/5 flex-grow place-items-center">
<div className='p-5'>
    <div className="avatar">
    <div className="w-52 rounded-full">
        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
    </div>

    </div>

    <h3 className='pt-5 font-bold text-3xl'>this is the name</h3>

    
    <h4 className=' text-xl'>@username</h4>
    <div className="badge badge-primary">role here</div>

    
    <ul className="pt-5">
    <li className="text-md"><span className="font-bold">Contact:</span> 43532443534</li>
    <li className="text-md"><span className="font-bold">Email:</span> username@cvsu.edu.ph</li>
    <li className="text-md"><span className="font-bold">Joined:</span> Jan 12, 2205</li>
</ul>




</div>
  

  </div>
  <div className="card bg-base-100 my-4 ml-3 border rounded-box grid  w-2/3 flex-grow ">

  <div className="m-6">
  <div className="grid gap-4">
    {/* Card 1 */}
    <div className="card bg-base-100 w-full shadow-xl border rounded-box">
      <div className="card-body">
        <p>name of the course</p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="card bg-base-100 w-full shadow-xl border rounded-box">
      <div className="card-body">
        <p>name of the course</p>
      </div>
    </div>

    {/* Card 3 */}
    <div className="card bg-base-100 w-full shadow-xl border rounded-box">
      <div className="card-body">
        <p>name of the course</p>
      </div>
    </div>

    
  </div>
</div>

       


  </div>
</div>

    </>
  )
}

export default ProfileDetailsPage