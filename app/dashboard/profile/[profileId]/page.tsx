import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileDetailsPageClient from "@/app/components/ProfileDetailsPageClient";

interface ProfileDetailsPageProps {
  params: {
    profileId: string;
  };
}

const ProfileDetailsPage = async ({ params }: ProfileDetailsPageProps) => {
  const session = await getServerSession(authOptions);

  console.log('Session:', session);
  console.log('User ID:', session?.user?.id);

  if (!session) {
    notFound();
  }

  const { profileId } = params;  // Use destructuring correctly

  const userRecord = await prisma.user.findUnique({
    where: { user_id: parseInt(profileId) },
  });

  if (!userRecord) {
    return (
      <div>
        <h1>User not found</h1>
      </div>
    );
  }

  const user = {
    user_id: userRecord.user_id,
    email: userRecord.email,
    username: userRecord.username,
    first_name: userRecord.first_name,
    last_name: userRecord.last_name,
    profile_picture_url: userRecord.profile_picture_url,
    role: userRecord.role,
    contact_number: userRecord.contact_number,
    joined_date: userRecord.created_at.toISOString(),
    password: userRecord.password,
  };

  return <ProfileDetailsPageClient user={user} />;
};

export default ProfileDetailsPage;
