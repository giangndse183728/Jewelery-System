using AutoMapper;
using BusinessObjects.DTO.ResponseDto;
using BusinessObjects.Models;
using HtmlAgilityPack;
using Repositories.Interface;
using Services.Interface;
using System.Globalization;

namespace Services.Implementation;

public class GoldPriceService(IGoldPriceRepository goldPriceRepository, IMapper mapper) : IGoldPriceService
{
    public IGoldPriceRepository GoldPriceRepository { get; } = goldPriceRepository;
    public IMapper Mapper { get; } = mapper;

    public async Task<IEnumerable<GoldPriceResponseDto>?> GetGoldPrices()
    {
        var handler = new HttpClientHandler()
        {
            ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
        };
        var httpClient = new HttpClient(handler);
        var response = await httpClient.GetAsync("https://sjc.com.vn/xml/tygiavang.xml");
        var html = await response.Content.ReadAsStringAsync();

        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var updateTime = doc.DocumentNode.SelectSingleNode("//ratelist")?.Attributes["updated"]?.Value;

        var cities = doc.DocumentNode.SelectNodes("//ratelist/city");

        // Retrieve existing gold prices
        var existingGoldPrices = await GoldPriceRepository.Gets();
        var lastRecord = existingGoldPrices.LastOrDefault();
        // check ngày nếu LastFetchTime của bản ghi cuối cùng trong DB khác ngày hiện tại thì fetch dữ liệu mới
        if (lastRecord == null || (lastRecord != null && lastRecord.LastFetchTime?.Date != DateTime.UtcNow.Date))
        {
            var goldPriceDict = existingGoldPrices?.ToDictionary(gp => (gp.City?.Trim().ToLower(), gp.Type?.Trim().ToLower()));

            // Collections to hold new and updated gold prices
            var updatedGoldPrices = new List<Gold>();
            var newGoldPrices = new List<Gold>();

            foreach (var cityNode in cities)
            {
                var city = cityNode.Attributes["name"]?.Value;
                var items = cityNode.SelectNodes("item");

                if (items == null) continue;

                foreach (var itemNode in items)
                {
                    var buyPrice = itemNode.Attributes["buy"]?.Value;
                    var sellPrice = itemNode.Attributes["sell"]?.Value;
                    var type = itemNode.Attributes["type"]?.Value;

                    var key = (city?.Trim().ToLower(), type?.Trim().ToLower());

                    if (goldPriceDict != null && goldPriceDict.TryGetValue(key, out var existingGoldPrice))
                    {
                        // Update existing gold price
                        existingGoldPrice.BuyPrice = decimal.Parse(buyPrice);
                        existingGoldPrice.SellPrice = decimal.Parse(sellPrice);
                        existingGoldPrice.LastUpdated = ParseAndUpdateTime(updateTime) ?? DateTime.UtcNow;
                        existingGoldPrice.LastFetchTime = DateTime.UtcNow;
                        updatedGoldPrices.Add(existingGoldPrice);
                    }
                    else
                    {
                        var newGoldPrice = new Gold
                        {
                            City = city,
                            BuyPrice = decimal.Parse(buyPrice),
                            SellPrice = decimal.Parse(sellPrice),
                            Type = type,
                            LastUpdated = ParseAndUpdateTime(updateTime) ?? DateTime.UtcNow,
                            LastFetchTime = DateTime.UtcNow
                        };
                        newGoldPrices.Add(newGoldPrice);
                    }
                }
            }

            // Perform batch updates and inserts
            if (updatedGoldPrices.Count != 0)
            {
                await GoldPriceRepository.UpdateBatch(updatedGoldPrices);
            }

            if (newGoldPrices.Count != 0)
            {
                await GoldPriceRepository.CreateBatch(newGoldPrices);
            }

            existingGoldPrices = await GoldPriceRepository.Gets();
        }

        return Mapper.Map<IEnumerable<GoldPriceResponseDto>>(existingGoldPrices);
    }
    private DateTime? ParseAndUpdateTime(string updateTimeString)
    {
        if (string.IsNullOrEmpty(updateTimeString))
            return null;

        const string format = "hh:mm:ss tt dd/MM/yyyy";
        if (DateTime.TryParseExact(updateTimeString, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedUpdateTime))
        {
            // Convert parsedUpdateTime to UTC if it's not already in UTC
            if (parsedUpdateTime.Kind != DateTimeKind.Utc)
            {
                parsedUpdateTime = parsedUpdateTime.ToUniversalTime();
            }
            return parsedUpdateTime;
        }
        return null;
    }
}
