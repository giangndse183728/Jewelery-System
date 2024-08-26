USE JSSATS
SELECT
    j.Name AS JewelryName,
    jm.GoldQuantity AS GoldQuantity,
    jm.StoneQuantity AS StoneQuantity,
    gmp.GoldStorePrice AS GoldPrice,
    smp.StoneStorePrice AS StonePrice,
    gp."Type" AS GoldType,
    sp."Type" AS StoneType,
    (jm.GoldQuantity * gmp.GoldStorePrice) + (jm.StoneQuantity * smp.StoneStorePrice) AS TotalPrice
FROM
    Jewelries j
    JOIN JewelryMaterials jm ON j.JewelryId = jm.JewelryId
	 JOIN GoldPrices gp ON jm.GoldPriceId = gp.GoldPriceId
	 JOIN StonePrices sp ON jm.StonePriceId = sp.StonePriceId
	 JOIN MasterPrices gmp ON jm.GoldPriceId = gmp.GoldPriceId
	 JOIN MasterPrices smp ON jm.StonePriceId = smp.StonePriceId