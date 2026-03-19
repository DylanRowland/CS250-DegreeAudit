import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans ">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-40 px-16 bg-white sm:items-start">
        {/* Logo and Description */}
        <Image
          src="/EESlogo.png"
          alt="Eagle Eyed Scholar logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Welcome To Eagle Eyed Scholar
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
             A smarter way to plan your path to SDSU. Track how community college courses apply to your degree and see your progress toward graduation before you even transfer.
          </p>
          {/* GitHub */}
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] hover:bg-black/[.04] dark:border-white/[.145] outline"
            href="https://github.com/DylanRowland/CS250-DegreeAudit"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="rounded-full"
              src="/githublogo.png"
              alt="GitHub logo"
              width={30}
              height={30}
            />
            Github
          </a>
        </div>

        {/*Getting Started Button*/}
        <a
          href="#getting-started-info"
          className="mt-12 rounded-full bg-black text-white px-6 py-3 hover:bg-gray-800"
        >
          Getting Started ↓
        </a>
      </main>
      {/*Getting Started Info*/}
      <section
        id="getting-started-info"
        className="w-full flex flex-col items-center justify-center bg-white py-20 px-16"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-black">
          See How Your Courses Apply to Your Degree
        </h2>
        <p className="max-w-2xl text-center leading-relaxed text-zinc-500 dark:text-zinc-400">
          Complete the form below with your school, courses you have taken, and your intended major to see classes that count towards your major and what classes you need to take. 
        </p>
      </section>
    
        {/*About Us Button*/}
        <a
          href="#about-us-info"
          className="mt-2 rounded-full bg-black text-white px-6 py-3 hover:bg-gray-800"
        >
          About Us ↓
        </a>
      {/* About Us Info */}
      <section
        id="about-us-info"
        className="w-full flex flex-col items-center justify-center bg-white py-20 px-16"
      >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        About Us
      </h2>
      <p className="max-w-2xl text-center leading-relaxed text-zinc-500 dark:text-zinc-400">
        We are a group of students at San Diego State University who have experienced the challenges of transferring from a community college to a university. We created Eagle Eyed Scholar to help other students navigate the transfer process and make informed decisions about their education. Our goal is to provide a user-friendly platform that allows students to easily track their progress towards graduation and plan their academic journey with confidence.  
      </p>
    </section>
    </div>
  );
}
