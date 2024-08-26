namespace Tools;
public static class IdGenerator
{
    private static readonly Random Random = new Random();
    private const string? Chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    public static string GenerateId()
    {
        var id = new char[7];
        for (int i = 0; i < 7; i++)
        {
            id[i] = Chars[Random.Next(Chars.Length)];
        }
        return new string(id);
    }
}