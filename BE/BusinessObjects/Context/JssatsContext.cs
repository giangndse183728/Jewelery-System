using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessObjects.Context
{
    public class JssatsContext : DbContext
    {
        public JssatsContext()
        {
        }

        public JssatsContext(DbContextOptions<JssatsContext> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //optionsBuilder.UseSqlServer(GetConnectionString());
                //optionsBuilder.UseNpgsql(GetConnectionString());
                optionsBuilder.UseSqlServer("Server=(local);Uid=sa;Pwd=12345;Database=JSSATS;TrustServerCertificate=True");
                //optionsBuilder.UseNpgsql("Host=aws-0-ap-southeast-1.pooler.supabase.com; Database=postgres; Code=postgres.gfjsnspjzlcfdrzxxksm; Password=Akaka0406+++");

            }
        }

        public DbSet<Bill> Bills { get; set; }
        public DbSet<BillJewelry> BillJewelries { get; set; }
        public DbSet<BillPromotion> BillPromotions { get; set; }
        public DbSet<Counter> Counters { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Jewelry> Jewelries { get; set; }
        public DbSet<JewelryCounter> JewelryCounters { get; set; }
        public DbSet<JewelryType> JewelryTypes { get; set; }
        public DbSet<Promotion> Promotions { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Warranty> Warranties { get; set; }
        public DbSet<JewelryMaterial> JewelryMaterials { get; set; }
        public DbSet<Gold> Golds { get; set; }
        public DbSet<Gem> Gems { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<CustomerPromotion> CustomerPromotions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // Define keys and relationships
            modelBuilder.Entity<Bill>().HasKey(b => b.BillId);
            modelBuilder.Entity<BillJewelry>().HasKey(bj => bj.BillJewelryId);
            modelBuilder.Entity<BillPromotion>().HasKey(bp => bp.BillPromotionId);
            modelBuilder.Entity<Counter>().HasKey(c => c.CounterId);
            modelBuilder.Entity<Customer>().HasKey(cu => cu.CustomerId);
            modelBuilder.Entity<Gold>().HasKey(gp => gp.GoldId);
            modelBuilder.Entity<Jewelry>().HasKey(j => j.JewelryId);
            modelBuilder.Entity<JewelryType>().HasKey(jt => jt.JewelryTypeId);
            modelBuilder.Entity<JewelryMaterial>().HasKey(jm => jm.JewelryMaterialId);
            modelBuilder.Entity<Promotion>().HasKey(p => p.PromotionId);
            modelBuilder.Entity<User>().HasKey(u => u.UserId);
            modelBuilder.Entity<Warranty>().HasKey(w => w.WarrantyId);
            modelBuilder.Entity<Gem>().HasKey(g => g.GemId);
            modelBuilder.Entity<Transaction>().HasKey(t => t.TransactionId);
            modelBuilder.Entity<CustomerPromotion>().HasKey(cp => cp.CustomerPromotionId);
            modelBuilder.Entity<JewelryCounter>().HasKey(cp => cp.JewelryCounterId);

            // Define relationships
            modelBuilder.Entity<JewelryMaterial>()
                .HasOne(jm => jm.Jewelry)
                .WithMany(j => j.JewelryMaterials)
                .HasForeignKey(jm => jm.JewelryId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Promotion>()
                .HasMany(p => p.BillPromotions)
                .WithOne(bp => bp.Promotion)
                .HasForeignKey(bp => bp.PromotionId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Warranty>()
                .HasOne(w => w.Jewelry)
                .WithMany(j => j.Warranties)
                .HasForeignKey(w => w.JewelryId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bill>()
                .HasOne(b => b.Customer)
                .WithMany(cu => cu.Bills)
                .HasForeignKey(b => b.CustomerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bill>()
                .HasOne(b => b.User)
                .WithMany(u => u.Bills)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bill>()
                .HasOne(b => b.Counter)
                .WithMany(c => c.Bills)
                .HasForeignKey(b => b.CounterId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<BillJewelry>()
                .HasOne(bj => bj.Bill)
                .WithMany(b => b.BillJewelries)
                .HasForeignKey(bj => bj.BillId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<BillJewelry>()
                .HasOne(bj => bj.Jewelry)
                .WithMany(j => j.BillJewelries)
                .HasForeignKey(bj => bj.JewelryId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<BillPromotion>()
                .HasOne(bp => bp.Bill)
                .WithMany(b => b.BillPromotions)
                .HasForeignKey(bp => bp.BillId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<BillPromotion>()
                .HasOne(bp => bp.Promotion)
                .WithMany(p => p.BillPromotions)
                .HasForeignKey(bp => bp.PromotionId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Jewelry>()
                .HasOne(j => j.JewelryType)
                .WithMany(jt => jt.Jewelries)
                .HasForeignKey(j => j.JewelryTypeId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Counter)
                .WithMany(c => c.Users)
                .HasForeignKey(u => u.CounterId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Bill)
                .WithMany(b => b.Transactions)
                .HasForeignKey(t => t.BillId)
                .OnDelete(DeleteBehavior.NoAction);


            // Specify column types for decimal properties in Bill
            modelBuilder.Entity<Bill>()
                .Property(b => b.TotalAmount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Bill>()
                .Property(b => b.DiscountRate)
                .HasColumnType("decimal(18,2)"); // Thêm dòng này để cấu hình DiscountRate

            // Specify column types for decimal properties in BillJewelry
            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.GemSellPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.GoldSellPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.GoldWeight)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.LaborCost)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.StoneQuantity)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BillJewelry>()
                .Property(bj => bj.TotalAmount)
                .HasColumnType("decimal(18,2)");

            // Specify column types for decimal properties in Promotion
            modelBuilder.Entity<Promotion>()
                .Property(p => p.DiscountRate)
                .HasColumnType("decimal(18,2)");

            // Specify column types for decimal properties in Gem
            modelBuilder.Entity<Gem>()
                .Property(g => g.BuyPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Gem>()
                .Property(g => g.SellPrice)
                .HasColumnType("decimal(18,2)");

            // Specify column types for decimal properties in Gold
            modelBuilder.Entity<Gold>()
                .Property(g => g.BuyPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Gold>()
                .Property(g => g.SellPrice)
                .HasColumnType("decimal(18,2)");

            // Specify column types for decimal properties in Jewelry
            modelBuilder.Entity<Jewelry>()
                .Property(j => j.LaborCost)
                .HasColumnType("decimal(18,2)");

            // Specify column types for decimal properties in JewelryMaterial
            modelBuilder.Entity<JewelryMaterial>()
                .Property(jm => jm.GoldWeight)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<JewelryMaterial>()
                .Property(jm => jm.StoneQuantity)
                .HasColumnType("decimal(18,2)");

            // Add similar configurations for other decimal properties in other entities...

            // Seed data
            // (Your seed data here)

            // Seed data
            modelBuilder.Entity<Counter>().HasData(
                new Counter { CounterId = 1, Name = "312" },
                new Counter { CounterId = 2, Name = "231" },
                new Counter { CounterId = 3, Name = "431" }
            );

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    UserId = 1,
                    Code = "ADMIN",
                    FullName = "ADMIN",
                    Password = "12345678",
                    Gender = "Male",
                    Email = "admin@gmail.com",
                    RoleId = 1,
                    Status = true,
                    CounterId = null
                },
                new User
                {
                    UserId = 2,
                    Code = "MANAGER",
                    FullName = "MANAGER",
                    Password = "12345678",
                    Email = "manager@gmail.com",
                    RoleId = 2,
                    Status = true,
                    CounterId = null
                },
                new User
                {
                    UserId = 3,
                    Code = "STAFF",
                    FullName = "STAFF",
                    Password = "12345678",
                    Email = "staff@gmail.com",
                    RoleId = 3,
                    Status = true,
                    CounterId = 3
                }
            );

            modelBuilder.Entity<Customer>().HasData(
                new Customer { CustomerId = 1, Code = "NGUYENVANA", FullName = "Nguyen Van A", Phone = "0123456789", Address = "Ha Noi" },
                new Customer { CustomerId = 2, Code = "NGUYENVANB", FullName = "Nguyen Van B", Phone = "0123456789", Address = "Ha Noi" },
                new Customer { CustomerId = 3, Code = "NGUYENVANC", FullName = "Nguyen Van C", Phone = "0123456789", Address = "Ha Noi" }
            );

            modelBuilder.Entity<JewelryType>().HasData(
                new JewelryType { JewelryTypeId = 1, Name = "Vòng tay" },
                new JewelryType { JewelryTypeId = 2, Name = "Nhẫn" },
                new JewelryType { JewelryTypeId = 3, Name = "Dây chuyền" },
                new JewelryType { JewelryTypeId = 4, Name = "Bông tai" },
                new JewelryType { JewelryTypeId = 5, Name = "Lắc chân" },
                new JewelryType { JewelryTypeId = 6, Name = "Mặt dây chuyền" },
                new JewelryType { JewelryTypeId = 7, Name = "Cài áo" },
                new JewelryType { JewelryTypeId = 8, Name = "Móc khóa" },
                new JewelryType { JewelryTypeId = 9, Name = "Lắc tay" },
                new JewelryType { JewelryTypeId = 10, Name = "Vòng cổ" }
            );

            modelBuilder.Entity<Jewelry>().HasData(
                new Jewelry
                {
                    JewelryId = 1,
                    Name = "Vòng tay",
                    JewelryTypeId = 1,
                    Barcode = "AVC131",
                    LaborCost = 213,
                    IsSold = true
                },
                new Jewelry
                {
                    JewelryId = 2,
                    Name = "Nhẫn",
                    JewelryTypeId = 2,
                    Barcode = "SAC132",
                    LaborCost = 231,
                    IsSold = false
                }
            );

            modelBuilder.Entity<JewelryMaterial>().HasData(
                new JewelryMaterial
                {
                    JewelryMaterialId = 1,
                    JewelryId = 1, // Ensure this JewelryId exists in the Jewelry table
                    GoldWeight = 30,
                    GoldId = 1,
                    StoneQuantity = 1,
                    GemId = 1
                },
                new JewelryMaterial
                {
                    JewelryMaterialId = 2,
                    JewelryId = 2, // Ensure this JewelryId exists in the Jewelry table
                    GoldWeight = 20,
                    GoldId = 2,
                    StoneQuantity = 1,
                    GemId = 2
                }
                // Removed invalid JewelryId references
            );

            modelBuilder.Entity<Promotion>().HasData(
                new Promotion
                {
                    PromotionId = 1,
                    Type = "Giảm giá",
                    Description = "Giảm giá 10%",
                    DiscountRate = 1,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(10)
                },
                new Promotion
                {
                    PromotionId = 2,
                    Type = "Giảm giá",
                    Description = "Giảm giá 20%",
                    DiscountRate = 2,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(10)
                },
                new Promotion
                {
                    PromotionId = 3,
                    Type = "Giảm giá",
                    Description = "Giảm giá 30%",
                    DiscountRate = 3,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(10)
                }
            );

            //modelBuilder.Entity<Bill>().HasData(
            //    new Bill { BillId = 1, CustomerId = 1, UserId = 3, CounterId = 1, SaleDate = DateTime.Now, TotalAmount = 500 },
            //    new Bill { BillId = 2, CustomerId = 2, UserId = 3, CounterId = 2, SaleDate = DateTime.Now, TotalAmount = 1200 }
            //);

            //modelBuilder.Entity<BillJewelry>().HasData(
            //    new BillJewelry { BillJewelryId = 1, BillId = 1, JewelryId = 1 },
            //    new BillJewelry { BillJewelryId = 2, BillId = 1, JewelryId = 2 }
            //);

            //modelBuilder.Entity<BillPromotion>().HasData(
            //    new BillPromotion { BillPromotionId = 1, BillId = 1, PromotionId = 1 },
            //    new BillPromotion { BillPromotionId = 2, BillId = 2, PromotionId = 1 }
            //);

            modelBuilder.Entity<Gem>().HasData(
                new Gem
                {
                    GemId = 1,
                    BuyPrice = 300,
                    SellPrice = 400,
                    LastUpdated = DateTime.Now,
                    Type = "Ruby",
                    City = "Ha Noi"
                },
                new Gem
                {
                    GemId = 2,
                    BuyPrice = 400,
                    SellPrice = 500,
                    LastUpdated = DateTime.Now,
                    Type = "Sapphire",
                    City = "Ha Noi"
                },
                new Gem
                {
                    GemId = 3,
                    BuyPrice = 500,
                    SellPrice = 600,
                    LastUpdated = DateTime.Now,
                    Type = "Emerald",
                    City = "Ha Noi"
                },
                new Gem
                {
                    GemId = 4,
                    BuyPrice = 500,
                    SellPrice = 600,
                    LastUpdated = DateTime.Now,
                    Type = "Tektite",
                    City = "Ha Noi"
                },
                new Gem
                {
                    GemId = 5,
                    BuyPrice = 500,
                    SellPrice = 600,
                    LastUpdated = DateTime.Now,
                    Type = "Peridot",
                    City = "Ha Noi"
                }
            );

            modelBuilder.Entity<Gold>().HasData(
                new Gold
                {
                    GoldId = 1,
                    BuyPrice = 1000,
                    SellPrice = 1200,
                    LastUpdated = DateTime.Now,
                    City = "Ha Noi",
                    Type = "9999"
                },
                new Gold
                {
                    GoldId = 2,
                    BuyPrice = 1200,
                    SellPrice = 1400,
                    LastUpdated = DateTime.Now,
                    City = "Ha Noi",
                    Type = "SCJ"
                },
                new Gold
                {
                    GoldId = 3,
                    BuyPrice = 1400,
                    SellPrice = 1600,
                    LastUpdated = DateTime.Now,
                    City = "Ha Noi",
                    Type = "18k"
                }
            );
        }
    }
}
