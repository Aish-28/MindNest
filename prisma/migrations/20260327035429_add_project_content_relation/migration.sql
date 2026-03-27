-- CreateTable
CREATE TABLE "ProjectContent" (
    "projectId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "ProjectContent_pkey" PRIMARY KEY ("projectId","contentId")
);

-- AddForeignKey
ALTER TABLE "ProjectContent" ADD CONSTRAINT "ProjectContent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectContent" ADD CONSTRAINT "ProjectContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
