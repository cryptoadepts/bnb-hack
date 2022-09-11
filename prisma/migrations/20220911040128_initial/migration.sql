-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalForm" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tallyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExternalFormToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "_ExternalFormToUser_AB_unique" ON "_ExternalFormToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ExternalFormToUser_B_index" ON "_ExternalFormToUser"("B");

-- AddForeignKey
ALTER TABLE "_ExternalFormToUser" ADD CONSTRAINT "_ExternalFormToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ExternalForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExternalFormToUser" ADD CONSTRAINT "_ExternalFormToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
