// pages/profile/[profileId]/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Import auth options
import { notFound } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/app/components/LogoutButton";

interface User {
  user_id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  contact_number: string | null;
  profile_picture_url: string | null;
  joined_date: string;
}

interface ProfileDetailsPageProps {
  params: {
    profileId: string;
  };
}

const ProfileDetailsPage: React.FC<ProfileDetailsPageProps> = async ({ params }) => {
  // Fetch the session server-side
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound(); // Or redirect to a login page
  }

  const profileId = params.profileId;

  // Check if the profileId is the current user's profile or if it's an admin trying to view another user's profile
  if (session.user.id !== parseInt(profileId) && session.user.role !== 'Admin') {
    return (
      <div>
        <h1>Forbidden</h1>
        <p>You are not authorized to view this profile.</p>
      </div>
    );
  }

  // Fetch user data from the database based on the profileId (you can use Prisma or any other method)
  const userRecord = await prisma.user.findUnique({
    where: { user_id: parseInt(profileId) }
  });

  const user: User | null = userRecord ? {
    user_id: userRecord.user_id,
    email: userRecord.email,
    username: userRecord.username,
    first_name: userRecord.first_name,
    last_name: userRecord.last_name,
    profile_picture_url: userRecord.profile_picture_url,
    role: userRecord.role,
    contact_number: userRecord.contact_number,
    joined_date: userRecord.created_at.toISOString(),
  } : null;

  if (!user) {
    return (
      <div>
        <h1>User not found</h1>
      </div>
    );
  }


  return (
    <>
      <div className="flex w-full">
        <div className="card bg-base-100 my-4 ml-3 border rounded-box grid w-1/5 flex-grow place-items-center">
          <div className="p-5">
            <div className="avatar">
              <div className="w-52 rounded-full">
                <img src={user.profile_picture_url || ''} alt="User Avatar" />
              </div>
            </div>

            <h3 className="pt-5 font-bold text-3xl">{user.first_name} {user.last_name}</h3>
            <h4 className="text-xl">@{user.username}</h4>
            <div className="badge badge-primary">{user.role}</div>

            <ul className="pt-5">
              <li className="text-md"><span className="font-bold">Contact:</span> {user.contact_number}</li>
              <li className="text-md"><span className="font-bold">Email:</span> {user.email}</li>
              <li className="text-md"><span className="font-bold">Joined:</span> {user.joined_date}</li>
            </ul>

            <LogoutButton />

          </div>
        </div>

        <div className="card bg-base-100 my-4 ml-3 border rounded-box grid w-2/3 flex-grow">
          <div className="m-6">
            <div className="grid gap-4">
              {/* Card for courses or other profile-related data */}
              {/* Replace with actual course data or other profile info */}
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
  );
};

export default ProfileDetailsPage;
