-- CreateTable
CREATE TABLE "Topic" (
    "topic_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "course_id" INTEGER NOT NULL,
    "creator_id" INTEGER,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("topic_id")
);

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("course_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
