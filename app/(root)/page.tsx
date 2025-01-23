import Link from "next/link"


const Home = () => {
  return (
    <>
      <div className="hero bg-[#F5F5F5] min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src="https://png.pngtree.com/png-vector/20220106/ourlarge/pngtree-education-industry-school-books-png-image_4095933.png"
            className="max-w-full rounded-lg mb-16"
          />
          <div>
            <h1 className="text-5xl font-bold">Instruct AI</h1>
            <p className="py-6">
            Empowering Educators and Students: Your All-in-One AI-Powered Course Builder
            </p>
            <Link href="/register">
            <button className="btn btn-primary">Get Started</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home