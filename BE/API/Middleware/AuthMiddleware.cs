using API.Middleware;
using BusinessObjects.DTO;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;


public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public AuthMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task Invoke(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint != null)
        {
            var allowAnonymousRefreshTokenAttribute = endpoint.Metadata.GetMetadata<AllowAnonymousRefreshTokenAttribute>();
            if (allowAnonymousRefreshTokenAttribute != null)
            {
                await _next(context);
                return;
            }
        }

        // Token validation logic...
        if (context.Request.Headers.ContainsKey("Authorization"))
        {
            var token = context.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (!string.IsNullOrEmpty(token))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                try
                {
                    var jwtToken = tokenHandler.ReadJwtToken(token);
                    if (jwtToken.ValidTo < DateTime.UtcNow)
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        await context.Response.WriteAsync("Token has expired");
                        return;
                    }
                    var services = context.RequestServices;
                    var session = services.GetService(typeof(SessionContext)) as SessionContext ?? throw new Exception("SessionContext is not injection");
                    foreach (Claim claim in jwtToken.Claims)
                    {
                        if (string.IsNullOrEmpty(claim.Value))
                        {
                            continue;
                        }
                        if (claim.Type == "Id")
                        {
                            session.UserId = int.Parse(claim.Value);
                        }
                        if (claim.Type == "role")
                        {
                            session.RoleId = int.Parse(claim.Value);
                        }
                        if (claim.Type == JwtRegisteredClaimNames.Jti)
                        {
                            session.CounterId = int.Parse(claim.Value);
                        }
                        if (claim.Type == JwtRegisteredClaimNames.Sub)
                        {
                            session.Code = claim.Value;
                        }
                        if (claim.Type == JwtRegisteredClaimNames.Email)
                        {
                            session.Email = claim.Value;
                        }
                    }
                }
                catch (SecurityTokenException)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    await context.Response.WriteAsync("Invalid token");
                    return;
                }
            }
        }

        await _next(context);
    }
}
