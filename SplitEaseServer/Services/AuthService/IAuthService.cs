using System.Text.Json.Nodes;
using Newtonsoft.Json.Linq;
using SplitEase.Utils;

namespace SplitEase.Services.AuthService;

public interface IAuthService
{
    Task<CustomResponse> Register(JObject obj);
    Task<CustomResponse> Login(JObject obj);
}