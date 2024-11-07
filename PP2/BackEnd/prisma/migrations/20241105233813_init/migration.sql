-- CreateTable
CREATE TABLE "User" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AdminRegistrationRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SystemAdmin" (
    "aid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Profile" (
    "pid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,
    CONSTRAINT "Profile_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CodeTemplate" (
    "cid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "explanation" TEXT,
    "language" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "uid" INTEGER NOT NULL,
    "isForked" BOOLEAN NOT NULL DEFAULT false,
    "ogTemplateId" INTEGER,
    CONSTRAINT "CodeTemplate_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CodeTemplate_ogTemplateId_fkey" FOREIGN KEY ("ogTemplateId") REFERENCES "CodeTemplate" ("cid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Blog" (
    "bid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,
    "uid" INTEGER NOT NULL,
    CONSTRAINT "Blog_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "commentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bid" INTEGER NOT NULL,
    "uid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Comment_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Blog" ("bid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reply" (
    "replyId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "replierId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "Hidden" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Reply_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reply_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reply_replierId_fkey" FOREIGN KEY ("replierId") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "rateId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "upvote" BOOLEAN NOT NULL DEFAULT false,
    "downvote" BOOLEAN NOT NULL DEFAULT false,
    "uid" INTEGER NOT NULL,
    "bid" INTEGER,
    "commentId" INTEGER,
    "replyId" INTEGER,
    CONSTRAINT "Rating_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Blog" ("bid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rating_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply" ("replyId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "reportId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uid" INTEGER NOT NULL,
    "bid" INTEGER,
    "commentId" INTEGER,
    "replyId" INTEGER,
    "explanation" TEXT,
    CONSTRAINT "Report_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_bid_fkey" FOREIGN KEY ("bid") REFERENCES "Blog" ("bid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("commentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply" ("replyId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_BlogCodeTemplates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogCodeTemplates_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog" ("bid") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogCodeTemplates_B_fkey" FOREIGN KEY ("B") REFERENCES "CodeTemplate" ("cid") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE UNIQUE INDEX "_BlogCodeTemplates_AB_unique" ON "_BlogCodeTemplates"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogCodeTemplates_B_index" ON "_BlogCodeTemplates"("B");
