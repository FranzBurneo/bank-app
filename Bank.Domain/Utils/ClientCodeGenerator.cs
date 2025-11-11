using System.Security.Cryptography;
using System.Text;

namespace Bank.Domain.Utils
{
    public static class ClientCodeGenerator
    {
        private static readonly char[] Alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".ToCharArray(); // sin 0, O, I, 1

        public static string NewCode(int len = 8)
        {
            var rng = RandomNumberGenerator.Create();
            var bytes = new byte[len];
            rng.GetBytes(bytes);

            var sb = new StringBuilder("CL-");
            for (int i = 0; i < len; i++)
                sb.Append(Alphabet[bytes[i] % Alphabet.Length]);

            return sb.ToString();
        }
    }
}