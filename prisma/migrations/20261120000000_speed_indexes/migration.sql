-- Indexes for the lookups every page makes: an artist's art, live art newest first, an image's uses, orders by
-- date / buyer / artist. Without them each of these read the whole table, which only shows once there is real data.

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_email_idx" ON "Order"("email");

-- CreateIndex
CREATE INDEX "Order_bulkArtistId_idx" ON "Order"("bulkArtistId");

-- CreateIndex
CREATE INDEX "OrderItem_imageUrl_idx" ON "OrderItem"("imageUrl");

-- CreateIndex
CREATE INDEX "Artwork_artistId_createdAt_idx" ON "Artwork"("artistId", "createdAt");

-- CreateIndex
CREATE INDEX "Artwork_status_createdAt_idx" ON "Artwork"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Artwork_imageUrl_idx" ON "Artwork"("imageUrl");
