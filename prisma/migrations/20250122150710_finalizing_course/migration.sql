-- CreateTable
CREATE TABLE "_CourseOwners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourseOwners_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourseOwners_B_index" ON "_CourseOwners"("B");

-- AddForeignKey
ALTER TABLE "_CourseOwners" ADD CONSTRAINT "_CourseOwners_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("course_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseOwners" ADD CONSTRAINT "_CourseOwners_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
