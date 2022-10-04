/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_address_key` ON `user`(`address`);
