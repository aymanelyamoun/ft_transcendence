-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "creatorOf" TEXT[],
    "admineOf" TEXT[],
    "friends" TEXT[],
    "blockedUsers" TEXT[],
    "profilePic" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameRecord" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,

    CONSTRAINT "GameRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "messageSenderId" TEXT NOT NULL,
    "timeSent" TEXT NOT NULL,
    "messageRecieverId" TEXT NOT NULL,
    "msgId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "messagesId" TEXT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameRecord_recordId_key" ON "GameRecord"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_msgId_key" ON "Message"("msgId");

-- CreateIndex
CREATE UNIQUE INDEX "Messages_messagesId_key" ON "Messages"("messagesId");

-- AddForeignKey
ALTER TABLE "GameRecord" ADD CONSTRAINT "GameRecord_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_msgId_fkey" FOREIGN KEY ("msgId") REFERENCES "Messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messagesId_fkey" FOREIGN KEY ("messagesId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
