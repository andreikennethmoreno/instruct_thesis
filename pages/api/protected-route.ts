// pages/api/protected-route.ts

import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" }) // User is not authenticated
  }

  if (session.user.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden" }) // User is not an admin
  }

  // Continue with your API logic for authenticated admin users
  res.status(200).json({ message: "Success", data: "Protected data" })
}