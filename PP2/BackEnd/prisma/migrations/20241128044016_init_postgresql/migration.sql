-- CreateTable
CREATE TABLE "User" (
    "uid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "AdminRegistrationRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminRegistrationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemAdmin" (
    "aid" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "SystemAdmin_pkey" PRIMARY KEY ("aid")
);

-- CreateTable
CREATE TABLE "Profile" (
    "pid" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("pid")
);

-- CreateTable
CREATE TABLE "CodeTemplate" (
    "cid" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,
    "isForked" BOOLEAN NOT NULL DEFAULT false,
    "ogTemplateId" INTEGER,

    CONSTRAINT "CodeTemplate_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "Blog" (
    "bid" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,
    "uid" INTEGER NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("bid")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" SERIAL NOT NULL,
    "bid" INTEGER NOT NULL,
    "uid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("commentId")
);

-- CreateTable
CREATE TABLE "Reply" (
    "replyId" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "replierId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("replyId")
);

-- CreateTable
CREATE TABLE "Rating" (
    "rateId" SERIAL NOT NULL,
    "upvote" BOOLEAN NOT NULL DEFAULT false,
    "downvote" BOOLEAN NOT NULL DEFAULT false,
    "uid" INTEGER NOT NULL,
    "bid" INTEGER,
    "commentId" INTEGER,
    "replyId" INTEGER,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("rateId")
);

-- CreateTable
CREATE TABLE "Report" (
    "reportId" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "bid" INTEGER,
    "commentId" INTEGER,
    "replyId" INTEGER,
    "explanation" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("reportId")
);

-- CreateTable
CREATE TABLE "_TagCodeTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TagBlog" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_BlogCodeTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminRegistrationRequest_email_key" ON "AdminRegistrationRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminRegistrationRequest_token_key" ON "AdminRegistrationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "SystemAdmin_email_key" ON "SystemAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_uid_key" ON "Profile"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_uid_bid_key" ON "Rating"("uid", "bid");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_uid_commentId_key" ON "Rating"("uid", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_uid_replyId_key" ON "Rating"("uid", "replyId");

-- CreateIndex
CREATE UNIQUE INDEX "_TagCodeTemplates_AB_unique" ON "_TagCodeTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_TagCodeTemplates_B_index" ON "_TagCodeTemplates"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TagBlog_AB_unique" ON "_TagBlog"("A", "B");

-- CreateIndex
CREATE INDEX "_TagBlog_B_index" ON "_TagBlog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogCodeTemplates_AB_unique" ON "_BlogCodeTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogCodeTemplates_B_index" ON "_BlogCodeTemplates"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeTemplate" ADD CONSTRAINT "CodeTemplate_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeTemplate" ADD CONSTRAINT "CodeTemplate_ogTemplateId_fkey" FOREIGN KEY ("ogTemplateId") REFERENCES "CodeTemplate"("cid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Blog"("bid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_replierId_fkey" FOREIGN KEY ("replierId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Blog"("bid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("replyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Blog"("bid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("commentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("replyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagCodeTemplates" ADD CONSTRAINT "_TagCodeTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "CodeTemplate"("cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagCodeTemplates" ADD CONSTRAINT "_TagCodeTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("tagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagBlog" ADD CONSTRAINT "_TagBlog_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("bid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagBlog" ADD CONSTRAINT "_TagBlog_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("tagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogCodeTemplates" ADD CONSTRAINT "_BlogCodeTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("bid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogCodeTemplates" ADD CONSTRAINT "_BlogCodeTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "CodeTemplate"("cid") ON DELETE CASCADE ON UPDATE CASCADE;
