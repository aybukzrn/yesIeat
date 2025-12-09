-- CreateTable
CREATE TABLE `ADDRESS` (
    `addressID` INTEGER NOT NULL AUTO_INCREMENT,
    `uID` INTEGER NOT NULL,
    `addressTitle` VARCHAR(255) NOT NULL,
    `fullAddress` VARCHAR(255) NOT NULL,
    `flatNum` INTEGER NULL,
    `floorNum` INTEGER NULL,
    `aptNum` INTEGER NULL,

    INDEX `fk_address_user`(`uID`),
    PRIMARY KEY (`addressID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CARD_DETAIL` (
    `cardID` INTEGER NOT NULL AUTO_INCREMENT,
    `cardNum` VARCHAR(30) NOT NULL,
    `cardExpDate` VARCHAR(10) NOT NULL,
    `cardHolder` VARCHAR(255) NOT NULL,
    `cardType` VARCHAR(50) NOT NULL,
    `uID` INTEGER NOT NULL,

    INDEX `fk_card_user`(`uID`),
    PRIMARY KEY (`cardID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CATEGORY` (
    `categoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`categoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MENU` (
    `menuID` INTEGER NOT NULL AUTO_INCREMENT,
    `menuName` VARCHAR(255) NOT NULL,
    `menuPrice` FLOAT NOT NULL,

    PRIMARY KEY (`menuID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MENU_DETAIL` (
    `menuID` INTEGER NOT NULL,
    `prodID` INTEGER NOT NULL,

    INDEX `fk_menudetail_product`(`prodID`),
    PRIMARY KEY (`menuID`, `prodID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ORDERS` (
    `orderID` INTEGER NOT NULL AUTO_INCREMENT,
    `uID` INTEGER NOT NULL,
    `orderDate` DATETIME(0) NOT NULL,
    `orderTime` TIME(0) NOT NULL,
    `orderStatus` ENUM('pending', 'confirmed', 'delivered', 'canceled') NOT NULL,
    `addressID` INTEGER NOT NULL,
    `subTotal` FLOAT NOT NULL,

    INDEX `fk_order_address`(`addressID`),
    INDEX `fk_order_user`(`uID`),
    PRIMARY KEY (`orderID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ORDER_DETAIL` (
    `oDetailID` INTEGER NOT NULL AUTO_INCREMENT,
    `oQuantity` INTEGER NOT NULL,
    `oPriority` VARCHAR(255) NOT NULL,
    `deliveryNote` VARCHAR(255) NULL,
    `prodID` INTEGER NOT NULL,
    `orderID` INTEGER NOT NULL,
    `prodUnitPrice` FLOAT NOT NULL,

    INDEX `fk_odetail_order`(`orderID`),
    INDEX `fk_odetail_product`(`prodID`),
    PRIMARY KEY (`oDetailID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OWNER` (
    `oName` VARCHAR(255) NOT NULL,
    `oPassword` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`oName`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PAYMENT` (
    `paymentID` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentMethod` VARCHAR(50) NOT NULL,
    `paymentDate` DATETIME(0) NOT NULL,
    `amount` FLOAT NOT NULL,
    `uID` INTEGER NOT NULL,
    `orderID` INTEGER NOT NULL,

    INDEX `fk_payment_order`(`orderID`),
    INDEX `fk_payment_user`(`uID`),
    PRIMARY KEY (`paymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PRODUCT` (
    `prodID` INTEGER NOT NULL AUTO_INCREMENT,
    `prodName` VARCHAR(255) NOT NULL,
    `prodUnitPrice` FLOAT NOT NULL,
    `prodStock` INTEGER NOT NULL,
    `prodPhoto` VARCHAR(255) NOT NULL,
    `prodLabel` VARCHAR(255) NULL,
    `prodDesc` VARCHAR(255) NOT NULL,
    `categoryID` INTEGER NOT NULL,
    `oName` VARCHAR(255) NOT NULL,

    INDEX `fk_product_category`(`categoryID`),
    INDEX `fk_product_owner`(`oName`),
    PRIMARY KEY (`prodID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `USERS` (
    `uID` INTEGER NOT NULL AUTO_INCREMENT,
    `uMail` VARCHAR(255) NOT NULL,
    `uPassword` VARCHAR(255) NOT NULL,
    `uName` VARCHAR(100) NOT NULL,
    `uSurname` VARCHAR(100) NOT NULL,
    `uPhnNum` VARCHAR(12) NULL,

    UNIQUE INDEX `uMail`(`uMail`),
    PRIMARY KEY (`uID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ADDRESS` ADD CONSTRAINT `fk_address_user` FOREIGN KEY (`uID`) REFERENCES `USERS`(`uID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CARD_DETAIL` ADD CONSTRAINT `fk_card_user` FOREIGN KEY (`uID`) REFERENCES `USERS`(`uID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MENU_DETAIL` ADD CONSTRAINT `fk_menudetail_menu` FOREIGN KEY (`menuID`) REFERENCES `MENU`(`menuID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MENU_DETAIL` ADD CONSTRAINT `fk_menudetail_product` FOREIGN KEY (`prodID`) REFERENCES `PRODUCT`(`prodID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ORDERS` ADD CONSTRAINT `fk_order_address` FOREIGN KEY (`addressID`) REFERENCES `ADDRESS`(`addressID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ORDERS` ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`uID`) REFERENCES `USERS`(`uID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ORDER_DETAIL` ADD CONSTRAINT `fk_odetail_order` FOREIGN KEY (`orderID`) REFERENCES `ORDERS`(`orderID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ORDER_DETAIL` ADD CONSTRAINT `fk_odetail_product` FOREIGN KEY (`prodID`) REFERENCES `PRODUCT`(`prodID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAYMENT` ADD CONSTRAINT `fk_payment_order` FOREIGN KEY (`orderID`) REFERENCES `ORDERS`(`orderID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PAYMENT` ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`uID`) REFERENCES `USERS`(`uID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PRODUCT` ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`categoryID`) REFERENCES `CATEGORY`(`categoryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PRODUCT` ADD CONSTRAINT `fk_product_owner` FOREIGN KEY (`oName`) REFERENCES `OWNER`(`oName`) ON DELETE RESTRICT ON UPDATE CASCADE;
